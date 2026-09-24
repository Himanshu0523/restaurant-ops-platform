export class DeliveryLocationUpdatedEvent {
  constructor(
    public readonly deliveryId: string,
    public readonly latitude: number,
    public readonly longitude: number,
  ) {}
}
