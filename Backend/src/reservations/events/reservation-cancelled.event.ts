export class ReservationCancelledEvent {
  constructor(
    public readonly reservationId: string,
    public readonly branchId: string,
    public readonly reason?: string,
  ) {}
}
