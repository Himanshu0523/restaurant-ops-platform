export class DeliveryOutForDeliveryEvent {
  constructor(
    public readonly deliveryId: string,
    public readonly orderId: string,
  ) {}
}
