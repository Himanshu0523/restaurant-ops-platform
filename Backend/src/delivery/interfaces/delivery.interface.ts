import {
  DeliveryPartnerType,
  DeliveryStatus,
} from '../delivery.types.js';

export interface DeliveryAddressResponse {
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postalCode?: string;
    landmark?: string;
    recipientName?: string;
    recipientPhone?: string;
    latitude?: number;
    longitude?: number;
}

export interface DeliveryPartnerResponse {
    userId?: string;
    name?: string;
    phone?: string;
    type: DeliveryPartnerType;
}

export interface DeliveryLocationResponse {
    latitude: number;
    longitude: number;
    accuracy?: number;
    heading?: number;
    speed?: number;
    updatedAt: Date;
}

export interface DeliveryResponse {
    id: string;
    tenantId: string;
    restaurantId: string;
    branchId: string;
    orderId: string;
    deliveryNumber: string;
    status: DeliveryStatus;
    address: DeliveryAddressResponse;
    partner?: DeliveryPartnerResponse;
    currentLocation?: DeliveryLocationResponse;
    estimatedDeliveryAt?: Date;
    assignedAt?: Date;
    acceptedAt?: Date;
    readyForPickupAt?: Date;
    pickedUpAt?: Date;
    outForDeliveryAt?: Date;
    arrivedAt?: Date;
    deliveredAt?: Date;
    failedAt?: Date;
    failureReason?: string;
    deliveryInstructions?: string;
    distanceKm?: number;
    deliveryFee?: number;
    notes?: string;
    createdBy?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface DeliveryAttemptResponse {
    id: string;
    deliveryId: string;
    status: string;
    reason?: string;
    notes?: string;
    performedBy?: string;
    attemptedAt: Date;
}
