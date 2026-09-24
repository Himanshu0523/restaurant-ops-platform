export class ReservationConfirmedEvent {
  constructor(
    public readonly reservationId: string,
    public readonly branchId: string,
  ) {}
}
