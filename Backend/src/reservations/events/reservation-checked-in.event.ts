export class ReservationCheckedInEvent {
  constructor(
    public readonly reservationId: string,
    public readonly branchId: string,
    public readonly tableId: string,
  ) {}
}
