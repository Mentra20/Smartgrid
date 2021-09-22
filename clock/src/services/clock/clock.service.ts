import { Injectable } from '@nestjs/common';

@Injectable()
export class ClockService {

    date:Date = new Date(2021,9,1);

    
    doTick(): Date {
        this.date.setHours(this.date.getHours()+1);
        return this.date;
    }

}
