import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { PaymentsService } from './payments.service.js';
import { BranchesService } from '../branches/branches.service.js';

import { CreatePaymentDto } from './dto/create-payment.dto.js';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto.js';
import { CreateRefundDto } from './dto/create-refund.dto.js';
import { PaymentQueryDto } from './dto/payment-query.dto.js';

import { PaymentGateway } from './payments.types.js';

import { AuthGuard as JwtAuthGuard } from '../auth/auth.guard.js';
import { TenantGuard } from '../common/guards/tenant/tenant.guard.js';
import { TenantId } from '../common/decorators/tenant/tenant.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';

@Controller()
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly branchesService: BranchesService,
  ) {}

  // ── Initiate payment (tenant-guarded) ──────────────────────────────────────

  @Post('orders/:orderId/payments')
  @UseGuards(JwtAuthGuard, TenantGuard)
  async initiatePayment(
    @TenantId() tenantId: string,
    @CurrentUser() user: any,
    @Param('orderId') orderId: string,
    @Body() dto: CreatePaymentDto,
    // orderAmount derived from the order — placeholder; service resolves amount
  ) {
    const userId = user?.sub || user?.id || user?._id?.toString();

    // Amount must come from trusted source (order total).
    // For now the controller passes 0 — service is responsible for loading
    // order total. In a real implementation, inject OrdersService here.
    return this.paymentsService.initiatePayment(
      { tenantId, restaurantId: '', userId },
      '',
      orderId,
      0,  // TODO: resolve from OrdersService.findById(orderId).totalAmount
      dto,
    );
  }

  @Post('payments/:paymentId/confirm')
  @UseGuards(JwtAuthGuard, TenantGuard)
  confirmPayment(
    @TenantId() tenantId: string,
    @Param('paymentId') paymentId: string,
    @Body() dto: ConfirmPaymentDto,
  ) {
    return this.paymentsService.confirmPayment(
      { tenantId },
      paymentId,
      dto,
    );
  }

  @Get('orders/:orderId/payment')
  @UseGuards(JwtAuthGuard, TenantGuard)
  findByOrderId(
    @TenantId() tenantId: string,
    @Param('orderId') orderId: string,
  ) {
    return this.paymentsService.findByOrderId({ tenantId }, orderId);
  }

  @Get('payments/:paymentId')
  @UseGuards(JwtAuthGuard, TenantGuard)
  findById(
    @TenantId() tenantId: string,
    @Param('paymentId') paymentId: string,
  ) {
    return this.paymentsService.findById({ tenantId }, paymentId);
  }

  @Get('branches/:branchId/payments')
  @UseGuards(JwtAuthGuard, TenantGuard)
  findByBranch(
    @TenantId() tenantId: string,
    @Param('branchId') branchId: string,
    @Query() query: PaymentQueryDto,
  ) {
    return this.paymentsService.findByBranch({ tenantId }, branchId, query);
  }

  @Get('payments/:paymentId/transactions')
  @UseGuards(JwtAuthGuard, TenantGuard)
  findTransactions(
    @TenantId() tenantId: string,
    @Param('paymentId') paymentId: string,
  ) {
    return this.paymentsService.findTransactions({ tenantId }, paymentId);
  }

  // ── Refunds ────────────────────────────────────────────────────────────────

  @Post('payments/:paymentId/refunds')
  @UseGuards(JwtAuthGuard, TenantGuard)
  createRefund(
    @TenantId() tenantId: string,
    @CurrentUser() user: any,
    @Param('paymentId') paymentId: string,
    @Body() dto: CreateRefundDto,
  ) {
    const userId = user?.sub || user?.id || user?._id?.toString();
    return this.paymentsService.createRefund(
      { tenantId, userId },
      paymentId,
      dto,
    );
  }

  @Get('payments/:paymentId/refunds')
  @UseGuards(JwtAuthGuard, TenantGuard)
  findRefunds(
    @TenantId() tenantId: string,
    @Param('paymentId') paymentId: string,
  ) {
    return this.paymentsService.findRefunds({ tenantId }, paymentId);
  }

  // ── Webhooks (no auth — verified by gateway signature) ────────────────────

  @Post('payments/webhooks/:gateway')
  async handleWebhook(
    @Param('gateway') gatewayParam: string,
    @Headers('x-razorpay-signature') razorpaySignature: string,
    @Headers('stripe-signature') stripeSignature: string,
    @Req() req: any,
  ) {
    const rawBody = (req as any).rawBody || '';
    const signature = razorpaySignature || stripeSignature || '';

    const gateway = gatewayParam.toUpperCase() as PaymentGateway;

    const body = req.body as Record<string, unknown>;

    // Extract event id/type — gateway-specific
    const eventId =
      (body?.['event_id'] as string) ||        // Stripe uses body.id
      (body?.['id'] as string) ||
      Date.now().toString();

    const eventType =
      (body?.['event'] as string) ||           // Razorpay
      (body?.['type'] as string) ||            // Stripe
      'unknown';

    return this.paymentsService.processWebhook(
      gateway,
      rawBody,
      signature,
      eventId,
      eventType,
      body,
    );
  }
}
