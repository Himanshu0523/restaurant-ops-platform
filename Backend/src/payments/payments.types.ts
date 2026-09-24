export enum PaymentStatus {
    CREATED = 'CREATED',
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    AUTHORIZED = 'AUTHORIZED',
    CAPTURED = 'CAPTURED',
    FAILED = 'FAILED',
    CANCELLED = 'CANCELLED',
    PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED',
    REFUNDED = 'REFUNDED',
}

export enum PaymentMethod {
    CARD = 'CARD',
    UPI = 'UPI',
    NET_BANKING = 'NET_BANKING',
    WALLET = 'WALLET',
    CASH = 'CASH',
    COD = 'COD',
}

export enum PaymentGateway {
    RAZORPAY = 'RAZORPAY',
    STRIPE = 'STRIPE',
    INTERNAL = 'INTERNAL',
}

export enum PaymentTransactionType {
    AUTHORIZATION = 'AUTHORIZATION',
    CAPTURE = 'CAPTURE',
    PAYMENT = 'PAYMENT',
    VOID = 'VOID',
    REFUND = 'REFUND',
}

export enum PaymentTransactionStatus {
    PENDING = 'PENDING',
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED',
}

export enum RefundStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
    CANCELLED = 'CANCELLED',
}