export class ReservationCreatedEvent {
  constructor(
    public readonly reservationId: string,
    public readonly branchId: string,
    public readonly customerId?: string,
  ) {}
}
