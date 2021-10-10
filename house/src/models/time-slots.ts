export class TimeSlots {
  private start: Date;
  private end: Date;

  constructor(start: Date, end: Date) {
    this.start = start;
    this.end = end;
  }
  public getStart(): Date {
    return this.start;
  }
  public getEnd(): Date {
    return this.end;
  }
}

export class TimeSlotsList {
  private timeSlots: TimeSlots[] = [];

  addSlots(start: Date, end: Date) {
    this.timeSlots.push(new TimeSlots(start, end));
  }

  isConsump(date: Date): boolean {
    for (const ts of this.timeSlots) {
      if (ts.getStart() <= date && date <= ts.getEnd()) {
        return true;
      }
    }
    return false;
  }

  removeTimeSlot(date: Date) {
    this.timeSlots = this.timeSlots.filter((slot)=>slot.getStart() >= date || date >= slot.getEnd())
  }
}
