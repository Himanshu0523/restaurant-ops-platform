export class ReservationNoShowEvent {
  constructor(
    public readonly reservationId: string,
    public readonly branchId: string,
  ) {}
}
