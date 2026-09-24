export class PaymentCancelledEvent {
  constructor(
    public readonly paymentId: string,
    public readonly orderId: string,
  ) {}
}
