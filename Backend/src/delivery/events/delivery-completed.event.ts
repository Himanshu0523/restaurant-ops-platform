export class DeliveryCompletedEvent {
  constructor(
    public readonly deliveryId: string,
    public readonly orderId: string,
  ) {}
}
