export class DeliveryPickedUpEvent {
  constructor(
    public readonly deliveryId: string,
    public readonly orderId: string,
  ) {}
}
