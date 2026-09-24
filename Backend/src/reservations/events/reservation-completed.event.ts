export class ReservationCompletedEvent {
  constructor(
    public readonly reservationId: string,
    public readonly branchId: string,
  ) {}
}
