export class TimeSlots {
  private start: Date;
  private end: Date;
  private consumption: number;

  constructor(start: Date, end: Date, consumption: number) {
    this.start = start;
    this.end = end;
    this.consumption = consumption;
  }
  public getStart(): Date {
    return this.start;
  }
  public getEnd(): Date {
    return this.end;
  }
  public getConsumption(): number {
    return this.consumption;
  }
}

export class TimeSlotsList {
  private timeSlots: TimeSlots[] = [];

  addSlots(start: Date, end: Date, consumption: number) {
    this.timeSlots.push(new TimeSlots(start, end, consumption));
  }

  getConsumption(date: Date) {
    for (const ts of this.timeSlots) {
      if (ts.getStart() <= date && date <= ts.getEnd()) {
        return ts.getConsumption();
      }
    }
    return 0;
  }
}
