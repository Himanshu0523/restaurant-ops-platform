import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
  Order,
  OrderDocument,
} from './schemas/order.schema.js';

import {
  MenuItem,
  MenuItemDocument,
} from '../menu/schemas/menu-item.schema.js';

import {
  Drop,
  DropDocument,
} from '../drops/schemas/drop.schema.js';

import { CreateOrderDto, CreateOrderItemInput } from './dto/create-order.dto.js';
import { UpdateOrderDto } from './dto/update-order.dto.js';
import { AddOrderItemDto } from './dto/add-order-item.dto.js';
import { UpdateOrderItemDto } from './dto/update-order-item.dto.js';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto.js';
import { CancelOrderDto } from './dto/cancel-order.dto.js';
import { ConfirmOrderDto } from './dto/confirm-order.dto.js';
import { ApplyCouponDto } from './dto/apply-coupon.dto.js';
import { OrderQueryDto } from './dto/order-query.dto.js';

import {
  FulfillmentStatus,
  OrderStatus,
  OrderType,
  PaymentStatus,
} from './order.types.js';

import { OrderResponse } from './interfaces/order.interface.js';
import { ORDER_DEFAULTS } from './constants/order.constants.js';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,

    @InjectModel(MenuItem.name)
    private readonly menuItemModel: Model<MenuItemDocument>,

    @InjectModel(Drop.name)
    private readonly dropModel: Model<DropDocument>,
  ) {}

  async create(
    context: { tenantId: string; restaurantId: string; userId: string },
    branchId: string,
    dto: CreateOrderDto,
  ): Promise<OrderResponse> {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('Order must contain at least one item');
    }

    const orderItems = await Promise.all(
      dto.items.map((itemInput) =>
        this.buildOrderItemSnapshot(context.tenantId, branchId, itemInput),
      ),
    );

    const totals = this.calculateTotals(orderItems, 0, 0, 0);

    const orderNumber = this.generateOrderNumber();

    const order = await this.orderModel.create({
      tenantId: new Types.ObjectId(context.tenantId),
      restaurantId: new Types.ObjectId(context.restaurantId),
      branchId: new Types.ObjectId(branchId),
      customerId: context.userId ? new Types.ObjectId(context.userId) : undefined,
      tableId: dto.tableId ? new Types.ObjectId(dto.tableId) : undefined,
      reservationId: dto.reservationId ? new Types.ObjectId(dto.reservationId) : undefined,
      orderNumber,
      type: dto.type,
      status: OrderStatus.DRAFT,
      fulfillmentStatus: FulfillmentStatus.UNFULFILLED,
      paymentStatus: PaymentStatus.UNPAID,
      items: orderItems,
      subtotal: totals.subtotal,
      discountAmount: totals.discountAmount,
      taxAmount: totals.taxAmount,
      serviceFee: totals.serviceFee,
      deliveryFee: totals.deliveryFee,
      totalAmount: totals.totalAmount,
      customerNote: dto.customerNote,
      deliveryAddress: dto.deliveryAddress,
      createdBy: context.userId ? new Types.ObjectId(context.userId) : undefined,
    });

    return this.toSafeOrder(order);
  }

  async findById(
    context: { tenantId: string },
    orderId: string,
  ): Promise<OrderResponse> {
    const order = await this.orderModel
      .findOne({
        _id: orderId,
        tenantId: context.tenantId,
      })
      .lean();

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.toSafeOrder(order);
  }

  async findByBranch(
    context: { tenantId: string },
    branchId: string,
    query: OrderQueryDto,
  ) {
    const {
      page = 1,
      limit = 20,
      ...filters
    } = query;

    const filter: Record<string, any> = {
      tenantId: context.tenantId,
      branchId,
    };

    if (filters.status) {
      filter.status = filters.status;
    }

    if (filters.type) {
      filter.type = filters.type;
    }

    if (filters.paymentStatus) {
      filter.paymentStatus = filters.paymentStatus;
    }

    if (filters.customerId) {
      filter.customerId = filters.customerId;
    }

    if (filters.search) {
      filter.$or = [
        { orderNumber: { $regex: filters.search, $options: 'i' } },
        { customerNote: { $regex: filters.search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      this.orderModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.orderModel.countDocuments(filter),
    ]);

    return {
      data: orders.map((order) => this.toSafeOrder(order)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async update(
    context: { tenantId: string },
    orderId: string,
    dto: UpdateOrderDto,
  ): Promise<OrderResponse> {
    const order = await this.orderModel.findOne({
      _id: orderId,
      tenantId: context.tenantId,
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (
      order.status !== OrderStatus.DRAFT &&
      order.status !== OrderStatus.PENDING
    ) {
      throw new BadRequestException('Cannot edit details of confirmed/active order');
    }

    if (dto.tableId) {
      order.tableId = new Types.ObjectId(dto.tableId);
    }
    if (dto.customerNote !== undefined) {
      order.customerNote = dto.customerNote;
    }
    if (dto.deliveryAddress !== undefined) {
      order.deliveryAddress = dto.deliveryAddress;
    }

    await order.save();
    return this.toSafeOrder(order);
  }

  async confirm(
    context: { tenantId: string; userId: string },
    orderId: string,
    dto: ConfirmOrderDto,
  ): Promise<OrderResponse> {
    const order = await this.orderModel.findOne({
      _id: orderId,
      tenantId: context.tenantId,
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (
      order.status !== OrderStatus.DRAFT &&
      order.status !== OrderStatus.PENDING
    ) {
      throw new BadRequestException(
        `Cannot confirm order with status ${order.status}`,
      );
    }

    order.status = OrderStatus.CONFIRMED;
    order.fulfillmentStatus = FulfillmentStatus.ACCEPTED;
    order.confirmedAt = new Date();

    if (dto.note) {
      order.customerNote = order.customerNote
        ? `${order.customerNote} | ${dto.note}`
        : dto.note;
    }

    await order.save();
    return this.toSafeOrder(order);
  }

  async cancel(
    context: { tenantId: string; userId: string },
    orderId: string,
    dto: CancelOrderDto,
  ): Promise<OrderResponse> {
    const order = await this.orderModel.findOne({
      _id: orderId,
      tenantId: context.tenantId,
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (
      order.status === OrderStatus.COMPLETED ||
      order.status === OrderStatus.CANCELLED ||
      order.status === OrderStatus.REFUNDED
    ) {
      throw new BadRequestException(
        `Cannot cancel order with status ${order.status}`,
      );
    }

    order.status = OrderStatus.CANCELLED;
    order.fulfillmentStatus = FulfillmentStatus.CANCELLED;
    order.cancellationReason = dto.reason;
    order.cancelledAt = new Date();

    await order.save();
    return this.toSafeOrder(order);
  }

  async updateStatus(
    context: { tenantId: string },
    orderId: string,
    dto: UpdateOrderStatusDto,
  ): Promise<OrderResponse> {
    const order = await this.orderModel.findOne({
      _id: orderId,
      tenantId: context.tenantId,
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    order.status = dto.status;

    if (dto.status === OrderStatus.PREPARING) {
      order.fulfillmentStatus = FulfillmentStatus.PREPARING;
    } else if (dto.status === OrderStatus.READY) {
      order.fulfillmentStatus = FulfillmentStatus.READY;
    } else if (dto.status === OrderStatus.COMPLETED) {
      order.fulfillmentStatus = FulfillmentStatus.FULFILLED;
      order.paymentStatus = PaymentStatus.PAID;
      order.completedAt = new Date();
    } else if (dto.status === OrderStatus.CANCELLED) {
      order.fulfillmentStatus = FulfillmentStatus.CANCELLED;
      order.cancelledAt = new Date();
      if (dto.reason) order.cancellationReason = dto.reason;
    }

    await order.save();
    return this.toSafeOrder(order);
  }

  async addItem(
    context: { tenantId: string },
    orderId: string,
    dto: AddOrderItemDto,
  ): Promise<OrderResponse> {
    const order = await this.orderModel.findOne({
      _id: orderId,
      tenantId: context.tenantId,
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (
      order.status !== OrderStatus.DRAFT &&
      order.status !== OrderStatus.PENDING
    ) {
      throw new BadRequestException('Cannot add items to confirmed or active order');
    }

    const newItemSnapshot = await this.buildOrderItemSnapshot(
      context.tenantId,
      order.branchId.toString(),
      dto,
    );

    order.items.push(newItemSnapshot as any);

    const totals = this.calculateTotals(
      order.items,
      order.discountAmount,
      order.deliveryFee,
      order.serviceFee,
    );

    order.subtotal = totals.subtotal;
    order.taxAmount = totals.taxAmount;
    order.totalAmount = totals.totalAmount;

    await order.save();
    return this.toSafeOrder(order);
  }

  async updateItem(
    context: { tenantId: string },
    orderId: string,
    itemId: string,
    dto: UpdateOrderItemDto,
  ): Promise<OrderResponse> {
    const order = await this.orderModel.findOne({
      _id: orderId,
      tenantId: context.tenantId,
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (
      order.status !== OrderStatus.DRAFT &&
      order.status !== OrderStatus.PENDING
    ) {
      throw new BadRequestException('Cannot edit items of confirmed or active order');
    }

    const item = (order.items as any).id(itemId);
    if (!item) {
      throw new NotFoundException('Item not found in order');
    }

    if (dto.quantity !== undefined) {
      item.quantity = dto.quantity;
      item.subtotal = item.unitPrice * dto.quantity;
    }
    if (dto.specialInstructions !== undefined) {
      item.specialInstructions = dto.specialInstructions;
    }
    if (dto.variants !== undefined) {
      item.variants = dto.variants;
    }
    if (dto.addons !== undefined) {
      item.addons = dto.addons;
    }

    const totals = this.calculateTotals(
      order.items,
      order.discountAmount,
      order.deliveryFee,
      order.serviceFee,
    );

    order.subtotal = totals.subtotal;
    order.taxAmount = totals.taxAmount;
    order.totalAmount = totals.totalAmount;

    await order.save();
    return this.toSafeOrder(order);
  }

  async removeItem(
    context: { tenantId: string },
    orderId: string,
    itemId: string,
  ): Promise<OrderResponse> {
    const order = await this.orderModel.findOne({
      _id: orderId,
      tenantId: context.tenantId,
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (
      order.status !== OrderStatus.DRAFT &&
      order.status !== OrderStatus.PENDING
    ) {
      throw new BadRequestException('Cannot remove items from confirmed or active order');
    }

    const initialLength = order.items.length;
    order.items = order.items.filter(
      (item: any) => item._id.toString() !== itemId,
    );

    if (order.items.length === initialLength) {
      throw new NotFoundException('Item not found in order');
    }

    const totals = this.calculateTotals(
      order.items,
      order.discountAmount,
      order.deliveryFee,
      order.serviceFee,
    );

    order.subtotal = totals.subtotal;
    order.taxAmount = totals.taxAmount;
    order.totalAmount = totals.totalAmount;

    await order.save();
    return this.toSafeOrder(order);
  }

  async applyCoupon(
    context: { tenantId: string },
    orderId: string,
    dto: ApplyCouponDto,
  ): Promise<OrderResponse> {
    const order = await this.orderModel.findOne({
      _id: orderId,
      tenantId: context.tenantId,
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Simplified coupon discount calculation (e.g., flat 10% for valid coupon demo)
    const discountAmount = Math.round(order.subtotal * 0.1);
    order.couponCode = dto.code;
    order.discountAmount = discountAmount;

    const totals = this.calculateTotals(
      order.items,
      discountAmount,
      order.deliveryFee,
      order.serviceFee,
    );

    order.subtotal = totals.subtotal;
    order.taxAmount = totals.taxAmount;
    order.totalAmount = totals.totalAmount;

    await order.save();
    return this.toSafeOrder(order);
  }

  private async buildOrderItemSnapshot(
    tenantId: string,
    branchId: string,
    input: CreateOrderItemInput | AddOrderItemDto,
  ) {
    let unitPrice = 0;
    let nameSnapshot = '';
    let descriptionSnapshot = '';
    let preparationTimeMinutes = 0;
    let categoryId: Types.ObjectId | undefined;

    if (input.dropId) {
      const drop = await this.dropModel.findOne({
        _id: input.dropId,
        tenantId,
        branchId,
        deletedAt: null,
      });

      if (!drop) {
        throw new NotFoundException('Drop not found for this order item');
      }

      unitPrice = drop.price;
      nameSnapshot = drop.name;
      descriptionSnapshot = drop.description ?? '';
    } else {
      const menuItem = await this.menuItemModel.findOne({
        _id: input.menuItemId,
        tenantId,
        branchId,
        deletedAt: null,
      });

      if (!menuItem) {
        throw new NotFoundException('Menu item not found for this branch');
      }

      unitPrice = menuItem.price ?? 0;
      nameSnapshot = menuItem.name;
      descriptionSnapshot = menuItem.description ?? '';
      preparationTimeMinutes = menuItem.preparationTimeMinutes ?? 0;
      categoryId = menuItem.categoryId;
    }

    const subtotal = unitPrice * input.quantity;

    return {
      menuItemId: new Types.ObjectId(input.menuItemId),
      categoryId,
      dropId: input.dropId ? new Types.ObjectId(input.dropId) : undefined,
      nameSnapshot,
      descriptionSnapshot,
      unitPrice,
      quantity: input.quantity,
      discountAmount: 0,
      taxAmount: 0,
      subtotal,
      variants: input.variants ?? [],
      addons: input.addons ?? [],
      specialInstructions: input.specialInstructions,
      preparationTimeMinutes,
    };
  }

  private calculateTotals(
    items: any[],
    discountAmount = 0,
    deliveryFee = 0,
    serviceFee = 0,
  ) {
    const subtotal = items.reduce(
      (sum, item) => sum + (item.subtotal || item.unitPrice * item.quantity),
      0,
    );

    const taxableAmount = Math.max(0, subtotal - discountAmount);
    const taxAmount = Math.round(taxableAmount * ORDER_DEFAULTS.DEFAULT_TAX_RATE);
    const totalAmount = Math.max(
      0,
      subtotal - discountAmount + taxAmount + serviceFee + deliveryFee,
    );

    return {
      subtotal,
      discountAmount,
      taxAmount,
      deliveryFee,
      serviceFee,
      totalAmount,
    };
  }

  private generateOrderNumber(): string {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return `ORD-${dateStr}-${randomSuffix}`;
  }

  private toSafeOrder(order: any): OrderResponse {
    return {
      id: order._id.toString(),
      tenantId: order.tenantId.toString(),
      restaurantId: order.restaurantId.toString(),
      branchId: order.branchId.toString(),
      customerId: order.customerId?.toString(),
      tableId: order.tableId?.toString(),
      reservationId: order.reservationId?.toString(),
      dropId: order.dropId?.toString(),

      orderNumber: order.orderNumber,
      type: order.type,
      status: order.status,
      fulfillmentStatus: order.fulfillmentStatus,
      paymentStatus: order.paymentStatus,

      items: (order.items || []).map((item: any) => ({
        id: item._id?.toString(),
        menuItemId: item.menuItemId?.toString(),
        categoryId: item.categoryId?.toString(),
        dropId: item.dropId?.toString(),
        nameSnapshot: item.nameSnapshot,
        descriptionSnapshot: item.descriptionSnapshot,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        discountAmount: item.discountAmount ?? 0,
        taxAmount: item.taxAmount ?? 0,
        subtotal: item.subtotal,
        variants: item.variants ?? [],
        addons: item.addons ?? [],
        specialInstructions: item.specialInstructions,
        preparationTimeMinutes: item.preparationTimeMinutes ?? 0,
      })),

      subtotal: order.subtotal ?? 0,
      discountAmount: order.discountAmount ?? 0,
      taxAmount: order.taxAmount ?? 0,
      deliveryFee: order.deliveryFee ?? 0,
      serviceFee: order.serviceFee ?? 0,
      totalAmount: order.totalAmount ?? 0,

      couponCode: order.couponCode,
      customerNote: order.customerNote,
      cancellationReason: order.cancellationReason,
      deliveryAddress: order.deliveryAddress,

      confirmedAt: order.confirmedAt,
      completedAt: order.completedAt,
      cancelledAt: order.cancelledAt,

      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }
}
