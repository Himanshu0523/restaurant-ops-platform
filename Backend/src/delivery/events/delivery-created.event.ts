export class DeliveryCreatedEvent {
  constructor(
    public readonly deliveryId: string,
    public readonly orderId: string,
    public readonly branchId: string,
  ) {}
}
