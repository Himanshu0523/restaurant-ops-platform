export class DeliveryAssignedEvent {
  constructor(
    public readonly deliveryId: string,
    public readonly partnerId: string,
    public readonly branchId: string,
  ) {}
}
