import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
  Delivery,
  DeliveryDocument,
} from './schemas/delivery.schema.js';
import {
  DeliveryAttempt,
  DeliveryAttemptDocument,
} from './schemas/delivery-attempt.schema.js';

import { CreateDeliveryDto } from './dto/create-delivery.dto.js';
import { UpdateDeliveryDto } from './dto/update-delivery.dto.js';
import { AssignDeliveryPartnerDto } from './dto/assign-delivery-partner.dto.js';
import { UpdateDeliveryLocationDto } from './dto/update-delivery-location.dto.js';
import { MarkPickupDto } from './dto/mark-pickup.dto.js';
import { MarkDeliveredDto } from './dto/mark-delivered.dto.js';
import { RecordDeliveryFailureDto } from './dto/record-delivery-failure.dto.js';
import { DeliveryQueryDto } from './dto/delivery-query.dto.js';

import {
  DeliveryAttemptStatus,
  DeliveryPartnerType,
  DeliveryStatus,
} from './delivery.types.js';

import {
  DELIVERY_NUMBER_PREFIX,
  DEFAULT_DELIVERY_ETA_MINUTES,
} from './constants/delivery.constants.js';

import {
  DeliveryAttemptResponse,
  DeliveryResponse,
} from './interfaces/delivery.interface.js';

/** Allowed transitions for the delivery state machine */
const VALID_TRANSITIONS: Record<DeliveryStatus, DeliveryStatus[]> = {
  [DeliveryStatus.PENDING]: [
    DeliveryStatus.ASSIGNMENT_PENDING,
    DeliveryStatus.CANCELLED,
  ],
  [DeliveryStatus.ASSIGNMENT_PENDING]: [
    DeliveryStatus.ASSIGNED,
    DeliveryStatus.CANCELLED,
  ],
  [DeliveryStatus.ASSIGNED]: [
    DeliveryStatus.ACCEPTED,
    DeliveryStatus.CANCELLED,
    DeliveryStatus.FAILED,
  ],
  [DeliveryStatus.ACCEPTED]: [
    DeliveryStatus.READY_FOR_PICKUP,
    DeliveryStatus.FAILED,
  ],
  [DeliveryStatus.READY_FOR_PICKUP]: [
    DeliveryStatus.PICKED_UP,
    DeliveryStatus.FAILED,
  ],
  [DeliveryStatus.PICKED_UP]: [
    DeliveryStatus.OUT_FOR_DELIVERY,
    DeliveryStatus.FAILED,
  ],
  [DeliveryStatus.OUT_FOR_DELIVERY]: [
    DeliveryStatus.ARRIVED,
    DeliveryStatus.FAILED,
  ],
  [DeliveryStatus.ARRIVED]: [
    DeliveryStatus.DELIVERED,
    DeliveryStatus.FAILED,
  ],
  [DeliveryStatus.DELIVERED]: [],
  [DeliveryStatus.FAILED]: [
    DeliveryStatus.ASSIGNED, // retry
  ],
  [DeliveryStatus.CANCELLED]: [],
};

@Injectable()
export class DeliveryService {
  constructor(
    @InjectModel(Delivery.name)
    private readonly deliveryModel: Model<DeliveryDocument>,

    @InjectModel(DeliveryAttempt.name)
    private readonly attemptModel: Model<DeliveryAttemptDocument>,
  ) {}

  async create(
    context: { tenantId: string; restaurantId: string; userId?: string },
    branchId: string,
    orderId: string,
    dto: CreateDeliveryDto,
  ): Promise<DeliveryResponse> {
    const existing = await this.deliveryModel.findOne({ orderId });
    if (existing) {
      throw new ConflictException('A delivery already exists for this order');
    }

    const deliveryNumber = this.generateDeliveryNumber();

    const estimatedDeliveryAt = new Date(
      Date.now() + DEFAULT_DELIVERY_ETA_MINUTES * 60000,
    );

    const delivery = await this.deliveryModel.create({
      tenantId: new Types.ObjectId(context.tenantId),
      restaurantId: new Types.ObjectId(context.restaurantId),
      branchId: new Types.ObjectId(branchId),
      orderId: new Types.ObjectId(orderId),
      deliveryNumber,
      status: DeliveryStatus.PENDING,
      address: {
        line1: dto.line1,
        line2: dto.line2,
        city: dto.city,
        state: dto.state,
        postalCode: dto.postalCode,
        landmark: dto.landmark,
        recipientName: dto.recipientName,
        recipientPhone: dto.recipientPhone,
        latitude: dto.latitude,
        longitude: dto.longitude,
      },
      estimatedDeliveryAt,
      deliveryInstructions: dto.deliveryInstructions,
      createdBy: context.userId ? new Types.ObjectId(context.userId) : undefined,
    });

    return this.toResponse(delivery);
  }

  async findByBranch(
    context: { tenantId: string },
    branchId: string,
    query: DeliveryQueryDto,
  ) {
    const { page = 1, limit = 20, ...filters } = query;
    const filter: Record<string, any> = {
      tenantId: context.tenantId,
      branchId,
    };

    if (filters.status) filter.status = filters.status;
    if (filters.partnerId) {
      filter['partner.userId'] = new Types.ObjectId(filters.partnerId);
    }

    const skip = (page - 1) * limit;

    const [deliveries, total] = await Promise.all([
      this.deliveryModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.deliveryModel.countDocuments(filter),
    ]);

    return {
      data: deliveries.map((d) => this.toResponse(d)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(
    context: { tenantId: string },
    deliveryId: string,
  ): Promise<DeliveryResponse> {
    const delivery = await this.deliveryModel
      .findOne({ _id: deliveryId, tenantId: context.tenantId })
      .lean();

    if (!delivery) {
      throw new NotFoundException('Delivery not found');
    }

    return this.toResponse(delivery);
  }

  async findByOrderId(
    context: { tenantId: string },
    orderId: string,
  ): Promise<DeliveryResponse> {
    const delivery = await this.deliveryModel
      .findOne({ orderId, tenantId: context.tenantId })
      .lean();

    if (!delivery) {
      throw new NotFoundException('Delivery not found for this order');
    }

    return this.toResponse(delivery);
  }

  async update(
    context: { tenantId: string },
    deliveryId: string,
    dto: UpdateDeliveryDto,
  ): Promise<DeliveryResponse> {
    const delivery = await this.deliveryModel.findOne({
      _id: deliveryId,
      tenantId: context.tenantId,
    });

    if (!delivery) {
      throw new NotFoundException('Delivery not found');
    }

    const addr = delivery.address as any;
    if (dto.line1 !== undefined) addr.line1 = dto.line1;
    if (dto.line2 !== undefined) addr.line2 = dto.line2;
    if (dto.city !== undefined) addr.city = dto.city;
    if (dto.state !== undefined) addr.state = dto.state;
    if (dto.postalCode !== undefined) addr.postalCode = dto.postalCode;
    if (dto.landmark !== undefined) addr.landmark = dto.landmark;
    if (dto.recipientName !== undefined) addr.recipientName = dto.recipientName;
    if (dto.recipientPhone !== undefined) addr.recipientPhone = dto.recipientPhone;
    if (dto.latitude !== undefined) addr.latitude = dto.latitude;
    if (dto.longitude !== undefined) addr.longitude = dto.longitude;
    if (dto.deliveryInstructions !== undefined) {
      delivery.deliveryInstructions = dto.deliveryInstructions;
    }

    await delivery.save();
    return this.toResponse(delivery);
  }

  async assignPartner(
    context: { tenantId: string },
    deliveryId: string,
    dto: AssignDeliveryPartnerDto,
  ): Promise<DeliveryResponse> {
    const delivery = await this.getAndValidateTransition(
      context,
      deliveryId,
      DeliveryStatus.ASSIGNED,
    );

    delivery.partner = {
      userId: new Types.ObjectId(dto.userId),
      name: dto.name,
      phone: dto.phone,
      type: dto.type || DeliveryPartnerType.RESTAURANT_STAFF,
    } as any;

    delivery.status = DeliveryStatus.ASSIGNED;
    delivery.assignedAt = new Date();

    await delivery.save();
    return this.toResponse(delivery);
  }

  async accept(
    context: { tenantId: string },
    deliveryId: string,
  ): Promise<DeliveryResponse> {
    const delivery = await this.getAndValidateTransition(
      context,
      deliveryId,
      DeliveryStatus.ACCEPTED,
    );

    delivery.status = DeliveryStatus.ACCEPTED;
    delivery.acceptedAt = new Date();

    await delivery.save();
    return this.toResponse(delivery);
  }

  async markReadyForPickup(
    context: { tenantId: string },
    deliveryId: string,
  ): Promise<DeliveryResponse> {
    const delivery = await this.getAndValidateTransition(
      context,
      deliveryId,
      DeliveryStatus.READY_FOR_PICKUP,
    );

    delivery.status = DeliveryStatus.READY_FOR_PICKUP;
    delivery.readyForPickupAt = new Date();

    await delivery.save();
    return this.toResponse(delivery);
  }

  async markPickedUp(
    context: { tenantId: string },
    deliveryId: string,
    dto?: MarkPickupDto,
  ): Promise<DeliveryResponse> {
    const delivery = await this.getAndValidateTransition(
      context,
      deliveryId,
      DeliveryStatus.PICKED_UP,
    );

    delivery.status = DeliveryStatus.PICKED_UP;
    delivery.pickedUpAt = new Date();
    if (dto?.notes) delivery.notes = dto.notes;

    await this.attemptModel.create({
      deliveryId: delivery._id,
      status: DeliveryAttemptStatus.STARTED,
      attemptedAt: new Date(),
    });

    await delivery.save();
    return this.toResponse(delivery);
  }

  async markOutForDelivery(
    context: { tenantId: string },
    deliveryId: string,
  ): Promise<DeliveryResponse> {
    const delivery = await this.getAndValidateTransition(
      context,
      deliveryId,
      DeliveryStatus.OUT_FOR_DELIVERY,
    );

    delivery.status = DeliveryStatus.OUT_FOR_DELIVERY;
    delivery.outForDeliveryAt = new Date();

    await delivery.save();
    return this.toResponse(delivery);
  }

  async markArrived(
    context: { tenantId: string },
    deliveryId: string,
  ): Promise<DeliveryResponse> {
    const delivery = await this.getAndValidateTransition(
      context,
      deliveryId,
      DeliveryStatus.ARRIVED,
    );

    delivery.status = DeliveryStatus.ARRIVED;
    delivery.arrivedAt = new Date();

    await delivery.save();
    return this.toResponse(delivery);
  }

  async markDelivered(
    context: { tenantId: string },
    deliveryId: string,
    dto?: MarkDeliveredDto,
  ): Promise<DeliveryResponse> {
    const delivery = await this.getAndValidateTransition(
      context,
      deliveryId,
      DeliveryStatus.DELIVERED,
    );

    delivery.status = DeliveryStatus.DELIVERED;
    delivery.deliveredAt = new Date();
    if (dto?.notes) delivery.notes = dto.notes;

    await this.attemptModel.updateOne(
      {
        deliveryId: delivery._id,
        status: DeliveryAttemptStatus.STARTED,
      },
      {
        $set: { status: DeliveryAttemptStatus.SUCCESSFUL },
      },
    );

    await delivery.save();
    return this.toResponse(delivery);
  }

  async recordFailure(
    context: { tenantId: string; userId?: string },
    deliveryId: string,
    dto: RecordDeliveryFailureDto,
  ): Promise<DeliveryResponse> {
    const delivery = await this.getAndValidateTransition(
      context,
      deliveryId,
      DeliveryStatus.FAILED,
    );

    delivery.status = DeliveryStatus.FAILED;
    delivery.failedAt = new Date();
    delivery.failureReason = dto.reason;

    await this.attemptModel.create({
      deliveryId: delivery._id,
      status: DeliveryAttemptStatus.FAILED,
      reason: dto.reason,
      notes: dto.notes,
      performedBy: context.userId
        ? new Types.ObjectId(context.userId)
        : undefined,
      attemptedAt: new Date(),
    });

    await delivery.save();
    return this.toResponse(delivery);
  }

  async updateLocation(
    context: { tenantId: string },
    deliveryId: string,
    dto: UpdateDeliveryLocationDto,
  ): Promise<DeliveryResponse> {
    const delivery = await this.deliveryModel.findOne({
      _id: deliveryId,
      tenantId: context.tenantId,
    });

    if (!delivery) {
      throw new NotFoundException('Delivery not found');
    }

    delivery.currentLocation = {
      latitude: dto.latitude,
      longitude: dto.longitude,
      accuracy: dto.accuracy,
      heading: dto.heading,
      speed: dto.speed,
      updatedAt: new Date(),
    } as any;

    await delivery.save();
    return this.toResponse(delivery);
  }

  async findAttempts(
    context: { tenantId: string },
    deliveryId: string,
  ): Promise<DeliveryAttemptResponse[]> {
    const delivery = await this.deliveryModel.findOne({
      _id: deliveryId,
      tenantId: context.tenantId,
    });

    if (!delivery) {
      throw new NotFoundException('Delivery not found');
    }

    const attempts = await this.attemptModel
      .find({ deliveryId })
      .sort({ attemptedAt: -1 })
      .lean();

    return attempts.map((a) => ({
      id: a._id.toString(),
      deliveryId: a.deliveryId.toString(),
      status: a.status,
      reason: a.reason,
      notes: a.notes,
      performedBy: a.performedBy?.toString(),
      attemptedAt: a.attemptedAt,
    }));
  }

  private async getAndValidateTransition(
    context: { tenantId: string },
    deliveryId: string,
    targetStatus: DeliveryStatus,
  ): Promise<DeliveryDocument> {
    const delivery = await this.deliveryModel.findOne({
      _id: deliveryId,
      tenantId: context.tenantId,
    });

    if (!delivery) {
      throw new NotFoundException('Delivery not found');
    }

    const allowed = VALID_TRANSITIONS[delivery.status] || [];
    if (!allowed.includes(targetStatus)) {
      throw new BadRequestException(
        `Cannot transition delivery from ${delivery.status} to ${targetStatus}`,
      );
    }

    return delivery;
  }

  private generateDeliveryNumber(): string {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');
    return `${DELIVERY_NUMBER_PREFIX}-${timestamp}-${random}`;
  }

  private toResponse(delivery: any): DeliveryResponse {
    return {
      id: delivery._id.toString(),
      tenantId: delivery.tenantId.toString(),
      restaurantId: delivery.restaurantId.toString(),
      branchId: delivery.branchId.toString(),
      orderId: delivery.orderId.toString(),
      deliveryNumber: delivery.deliveryNumber,
      status: delivery.status,
      address: delivery.address,
      partner: delivery.partner
        ? {
            userId: delivery.partner.userId?.toString(),
            name: delivery.partner.name,
            phone: delivery.partner.phone,
            type: delivery.partner.type,
          }
        : undefined,
      currentLocation: delivery.currentLocation ?? undefined,
      estimatedDeliveryAt: delivery.estimatedDeliveryAt,
      assignedAt: delivery.assignedAt,
      acceptedAt: delivery.acceptedAt,
      readyForPickupAt: delivery.readyForPickupAt,
      pickedUpAt: delivery.pickedUpAt,
      outForDeliveryAt: delivery.outForDeliveryAt,
      arrivedAt: delivery.arrivedAt,
      deliveredAt: delivery.deliveredAt,
      failedAt: delivery.failedAt,
      failureReason: delivery.failureReason,
      deliveryInstructions: delivery.deliveryInstructions,
      distanceKm: delivery.distanceKm,
      deliveryFee: delivery.deliveryFee,
      notes: delivery.notes,
      createdBy: delivery.createdBy?.toString(),
      createdAt: delivery.createdAt,
      updatedAt: delivery.updatedAt,
    };
  }
}
