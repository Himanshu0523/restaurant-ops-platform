export class PaymentAuthorizedEvent {
  constructor(
    public readonly paymentId: string,
    public readonly orderId: string,
  ) {}
}