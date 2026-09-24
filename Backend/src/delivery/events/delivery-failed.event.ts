export class DeliveryFailedEvent {
  constructor(
    public readonly deliveryId: string,
    public readonly reason: string,
  ) {}
}
