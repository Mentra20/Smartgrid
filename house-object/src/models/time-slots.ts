export class TimeSlots {
    private start : Date;
    private end : Date;
    private consumption : number;

    constructor(json:any){
        this.start = new Date(json.start);
        this.end = new Date(json.end);
        this.consumption = json.consumption;
    }
    public getStart():Date{
        return this.start;
    }
    public getEnd():Date{
        return this.end;
    }
    public getConsumption():number{
        return this.consumption;
    }

}

export class TimeSlotsList {
    private timeSlots:TimeSlots[]=[];

    constructor(json:any[]){
        json.forEach(element => {
            this.timeSlots.push(new TimeSlots(element));
        });
    }

    getConsumption(date: Date){
        for(const ts of this.timeSlots){
            if(ts.getStart()<=date && date<=ts.getEnd() ){
                return ts.getConsumption();
            }
        }
        return 0;
    }
}
