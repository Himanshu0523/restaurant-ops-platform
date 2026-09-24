import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
  Payment,
  PaymentDocument,
} from './schemas/payment.schema.js';
import {
  PaymentTransaction,
  PaymentTransactionDocument,
} from './schemas/payment-transaction.schema.js';
import {
  PaymentRefund,
  PaymentRefundDocument,
} from './schemas/payment-refund.schema.js';
import {
  PaymentWebhook,
  PaymentWebhookDocument,
} from './schemas/payment-webhook.schema.js';

import { CreatePaymentDto } from './dto/create-payment.dto.js';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto.js';
import { CreateRefundDto } from './dto/create-refund.dto.js';
import { PaymentQueryDto } from './dto/payment-query.dto.js';

import {
  PaymentGateway,
  PaymentStatus,
  PaymentTransactionStatus,
  PaymentTransactionType,
  RefundStatus,
} from './payments.types.js';

import {
  PAYMENT_NUMBER_PREFIX,
  REFUND_NUMBER_PREFIX,
  DEFAULT_CURRENCY,
  REFUNDABLE_STATUSES,
} from './constants/payment.constants.js';

import {
  GatewayCheckoutData,
  PaymentRefundResponse,
  PaymentResponse,
  PaymentTransactionResponse,
} from './interfaces/payment.interface.js';

import { PaymentGatewayFactory } from './gateways/payment-gateway.factory.js';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment.name)
    private readonly paymentModel: Model<PaymentDocument>,

    @InjectModel(PaymentTransaction.name)
    private readonly transactionModel: Model<PaymentTransactionDocument>,

    @InjectModel(PaymentRefund.name)
    private readonly refundModel: Model<PaymentRefundDocument>,

    @InjectModel(PaymentWebhook.name)
    private readonly webhookModel: Model<PaymentWebhookDocument>,

    private readonly gatewayFactory: PaymentGatewayFactory,
  ) {}

  //  Create payment intent 

  async initiatePayment(
    context: { tenantId: string; restaurantId: string; userId?: string },
    branchId: string,
    orderId: string,
    orderAmount: number,
    dto: CreatePaymentDto,
  ): Promise<GatewayCheckoutData> {
    // 1. Idempotency check
    const existing = await this.paymentModel.findOne({
      tenantId: context.tenantId,
      idempotencyKey: dto.idempotencyKey,
    });

    if (existing) {
      return this.toCheckoutData(existing);
    }

    // 2. Call gateway to create an order/payment intent
    const gatewayAdapter = this.gatewayFactory.getGateway(dto.gateway);

    const paymentNumber = this.generatePaymentNumber();

    const gatewayResult = await gatewayAdapter.createPayment({
      amount: orderAmount,
      currency: DEFAULT_CURRENCY,
      receipt: paymentNumber,
      metadata: {
        orderId,
        tenantId: context.tenantId,
      },
    });

    // 3. Persist payment record
    const payment = await this.paymentModel.create({
      tenantId: new Types.ObjectId(context.tenantId),
      restaurantId: new Types.ObjectId(context.restaurantId),
      branchId: new Types.ObjectId(branchId),
      orderId: new Types.ObjectId(orderId),
      customerId: context.userId ? new Types.ObjectId(context.userId) : undefined,
      paymentNumber,
      amount: orderAmount,
      refundedAmount: 0,
      currency: DEFAULT_CURRENCY,
      status: PaymentStatus.CREATED,
      method: dto.method,
      gateway: dto.gateway,
      gatewayOrderId: gatewayResult.gatewayOrderId,
      gatewayPaymentId: gatewayResult.gatewayPaymentId,
      idempotencyKey: dto.idempotencyKey,
    });

    // 4. Record transaction
    await this.transactionModel.create({
      paymentId: payment._id,
      type: PaymentTransactionType.PAYMENT,
      status: PaymentTransactionStatus.PENDING,
      amount: orderAmount,
    });

    return this.toCheckoutData(payment);
  }

  //  Confirm payment (client-side signature) 

  async confirmPayment(
    context: { tenantId: string },
    paymentId: string,
    dto: ConfirmPaymentDto,
  ): Promise<PaymentResponse> {
    const payment = await this.paymentModel.findOne({
      _id: paymentId,
      tenantId: context.tenantId,
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    const gatewayAdapter = this.gatewayFactory.getGateway(payment.gateway);

    const isValid = await gatewayAdapter.verifyPayment({
      gatewayOrderId: payment.gatewayOrderId || '',
      gatewayPaymentId: dto.gatewayPaymentId || '',
      gatewaySignature: dto.gatewaySignature || '',
    });

    if (!isValid) {
      payment.status = PaymentStatus.FAILED;
      payment.failureMessage = 'Signature verification failed';
      await payment.save();

      await this.transactionModel.create({
        paymentId: payment._id,
        type: PaymentTransactionType.PAYMENT,
        status: PaymentTransactionStatus.FAILED,
        amount: payment.amount,
        failureMessage: 'Signature verification failed',
        processedAt: new Date(),
      });

      throw new BadRequestException('Payment signature verification failed');
    }

    payment.status = PaymentStatus.CAPTURED;
    payment.gatewayPaymentId = dto.gatewayPaymentId ?? payment.gatewayPaymentId;
    payment.paidAt = new Date();
    await payment.save();

    await this.transactionModel.create({
      paymentId: payment._id,
      type: PaymentTransactionType.CAPTURE,
      status: PaymentTransactionStatus.SUCCESS,
      amount: payment.amount,
      gatewayTransactionId: dto.gatewayPaymentId,
      processedAt: new Date(),
    });

    return this.toPaymentResponse(payment);
  }

  // ── Find by order ──────────────────────────────────────────────────────────

  async findByOrderId(
    context: { tenantId: string },
    orderId: string,
  ): Promise<PaymentResponse> {
    const payment = await this.paymentModel
      .findOne({ orderId, tenantId: context.tenantId })
      .lean();

    if (!payment) {
      throw new NotFoundException('Payment not found for this order');
    }

    return this.toPaymentResponse(payment);
  }

  async findById(
    context: { tenantId: string },
    paymentId: string,
  ): Promise<PaymentResponse> {
    const payment = await this.paymentModel
      .findOne({ _id: paymentId, tenantId: context.tenantId })
      .lean();

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return this.toPaymentResponse(payment);
  }

  async findByBranch(
    context: { tenantId: string },
    branchId: string,
    query: PaymentQueryDto,
  ) {
    const { page = 1, limit = 20, status } = query;
    const filter: Record<string, any> = {
      tenantId: context.tenantId,
      branchId,
    };

    if (status) filter.status = status;

    const skip = (page - 1) * limit;
    const [payments, total] = await Promise.all([
      this.paymentModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.paymentModel.countDocuments(filter),
    ]);

    return {
      data: payments.map((p) => this.toPaymentResponse(p)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // ── Refunds ────────────────────────────────────────────────────────────────

  async createRefund(
    context: { tenantId: string; userId?: string },
    paymentId: string,
    dto: CreateRefundDto,
  ): Promise<PaymentRefundResponse> {
    const payment = await this.paymentModel.findOne({
      _id: paymentId,
      tenantId: context.tenantId,
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    const refundableStatuses: string[] = [...REFUNDABLE_STATUSES];
    if (!refundableStatuses.includes(payment.status)) {
      throw new BadRequestException(
        `Payment in status ${payment.status} is not eligible for refund`,
      );
    }

    const refundableAmount = payment.amount - payment.refundedAmount;
    if (dto.amount > refundableAmount) {
      throw new BadRequestException(
        `Refund amount ₹${dto.amount} exceeds refundable amount ₹${refundableAmount}`,
      );
    }

    const gatewayAdapter = this.gatewayFactory.getGateway(payment.gateway);

    const gatewayResult = await gatewayAdapter.refundPayment({
      gatewayPaymentId: payment.gatewayPaymentId!,
      amount: dto.amount,
      reason: dto.reason,
    });

    const refundNumber = this.generateRefundNumber();

    const refund = await this.refundModel.create({
      paymentId: payment._id,
      amount: dto.amount,
      status: RefundStatus.PROCESSING,
      refundNumber,
      gatewayRefundId: gatewayResult.gatewayRefundId,
      reason: dto.reason,
      initiatedBy: context.userId
        ? new Types.ObjectId(context.userId)
        : undefined,
    });

    // Update payment refunded amount and status
    payment.refundedAmount += dto.amount;

    if (payment.refundedAmount >= payment.amount) {
      payment.status = PaymentStatus.REFUNDED;
    } else {
      payment.status = PaymentStatus.PARTIALLY_REFUNDED;
    }

    await payment.save();

    await this.transactionModel.create({
      paymentId: payment._id,
      type: PaymentTransactionType.REFUND,
      status: PaymentTransactionStatus.SUCCESS,
      amount: dto.amount,
      gatewayTransactionId: gatewayResult.gatewayRefundId,
      processedAt: new Date(),
    });

    return this.toRefundResponse(refund);
  }

  async findRefunds(
    context: { tenantId: string },
    paymentId: string,
  ): Promise<PaymentRefundResponse[]> {
    const payment = await this.paymentModel.findOne({
      _id: paymentId,
      tenantId: context.tenantId,
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    const refunds = await this.refundModel
      .find({ paymentId })
      .sort({ createdAt: -1 })
      .lean();

    return refunds.map((r) => this.toRefundResponse(r));
  }

  async findTransactions(
    context: { tenantId: string },
    paymentId: string,
  ): Promise<PaymentTransactionResponse[]> {
    const payment = await this.paymentModel.findOne({
      _id: paymentId,
      tenantId: context.tenantId,
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    const transactions = await this.transactionModel
      .find({ paymentId })
      .sort({ createdAt: -1 })
      .lean();

    return transactions.map((t) => ({
      id: t._id.toString(),
      paymentId: t.paymentId.toString(),
      type: t.type,
      status: t.status,
      amount: t.amount,
      gatewayTransactionId: t.gatewayTransactionId,
      failureCode: t.failureCode,
      failureMessage: t.failureMessage,
      processedAt: t.processedAt,
      createdAt: (t as any).createdAt,
    }));
  }

  // ── Webhook processing ─────────────────────────────────────────────────────

  async processWebhook(
    gateway: PaymentGateway,
    rawPayload: string,
    signature: string,
    eventId: string,
    eventType: string,
    payload: Record<string, unknown>,
  ): Promise<{ received: boolean }> {
    // 1. Verify signature
    const gatewayAdapter = this.gatewayFactory.getGateway(gateway);
    const isValid = gatewayAdapter.verifyWebhook(rawPayload, signature);

    if (!isValid) {
      throw new BadRequestException('Invalid webhook signature');
    }

    // 2. Check for duplicate webhook
    const existing = await this.webhookModel.findOne({ eventId });
    if (existing?.processed) {
      return { received: true };
    }

    // 3. Store webhook in inbox (idempotent upsert)
    await this.webhookModel.findOneAndUpdate(
      { eventId },
      {
        $setOnInsert: {
          eventId,
          eventType,
          gateway,
          payload,
          processed: false,
        },
      },
      { upsert: true },
    );

    // 4. Process event
    try {
      await this.handleWebhookEvent(gateway, eventType, payload);

      await this.webhookModel.findOneAndUpdate(
        { eventId },
        { $set: { processed: true, processedAt: new Date() } },
      );
    } catch (err: any) {
      await this.webhookModel.findOneAndUpdate(
        { eventId },
        { $set: { processingError: err?.message || 'Unknown error' } },
      );
    }

    return { received: true };
  }

  private async handleWebhookEvent(
    gateway: PaymentGateway,
    eventType: string,
    payload: Record<string, unknown>,
  ): Promise<void> {
    // Map gateway-specific event types to internal actions
    const captureEvents = [
      'payment.captured',           // Razorpay
      'payment_intent.succeeded',   // Stripe
    ];

    const failedEvents = [
      'payment.failed',             // Razorpay
      'payment_intent.payment_failed', // Stripe
    ];

    if (captureEvents.includes(eventType)) {
      const gatewayPaymentId = this.extractPaymentId(payload);
      if (!gatewayPaymentId) return;

      const payment = await this.paymentModel.findOne({ gatewayPaymentId });
      if (!payment || payment.status === PaymentStatus.CAPTURED) return;

      payment.status = PaymentStatus.CAPTURED;
      payment.paidAt = new Date();
      await payment.save();
    } else if (failedEvents.includes(eventType)) {
      const gatewayPaymentId = this.extractPaymentId(payload);
      if (!gatewayPaymentId) return;

      const payment = await this.paymentModel.findOne({ gatewayPaymentId });
      if (!payment) return;

      payment.status = PaymentStatus.FAILED;
      await payment.save();
    }
  }

  private extractPaymentId(payload: Record<string, unknown>): string | null {
    // Razorpay: payload.payment.entity.id
    const razorpayId = (payload as any)?.payment?.entity?.id;
    if (razorpayId) return razorpayId;

    // Stripe: payload.data.object.id
    const stripeId = (payload as any)?.data?.object?.id;
    if (stripeId) return stripeId;

    return null;
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  private generatePaymentNumber(): string {
    const ts = Date.now().toString().slice(-8);
    const rand = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${PAYMENT_NUMBER_PREFIX}-${ts}-${rand}`;
  }

  private generateRefundNumber(): string {
    const ts = Date.now().toString().slice(-8);
    const rand = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${REFUND_NUMBER_PREFIX}-${ts}-${rand}`;
  }

  private toCheckoutData(payment: any): GatewayCheckoutData {
    return {
      paymentId: payment._id.toString(),
      paymentNumber: payment.paymentNumber,
      gateway: payment.gateway,
      gatewayOrderId: payment.gatewayOrderId,
      amount: payment.amount,
      currency: payment.currency,
    };
  }

  private toPaymentResponse(payment: any): PaymentResponse {
    return {
      id: payment._id.toString(),
      tenantId: payment.tenantId.toString(),
      restaurantId: payment.restaurantId.toString(),
      branchId: payment.branchId.toString(),
      orderId: payment.orderId.toString(),
      customerId: payment.customerId?.toString(),
      paymentNumber: payment.paymentNumber,
      amount: payment.amount,
      refundedAmount: payment.refundedAmount,
      currency: payment.currency,
      status: payment.status,
      method: payment.method,
      gateway: payment.gateway,
      gatewayOrderId: payment.gatewayOrderId,
      gatewayPaymentId: payment.gatewayPaymentId,
      idempotencyKey: payment.idempotencyKey,
      failureCode: payment.failureCode,
      failureMessage: payment.failureMessage,
      paidAt: payment.paidAt,
      cancelledAt: payment.cancelledAt,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    };
  }

  private toRefundResponse(refund: any): PaymentRefundResponse {
    return {
      id: refund._id.toString(),
      paymentId: refund.paymentId.toString(),
      amount: refund.amount,
      status: refund.status,
      refundNumber: refund.refundNumber,
      gatewayRefundId: refund.gatewayRefundId,
      reason: refund.reason,
      failureMessage: refund.failureMessage,
      initiatedBy: refund.initiatedBy?.toString(),
      completedAt: refund.completedAt,
      createdAt: refund.createdAt,
    };
  }
}
