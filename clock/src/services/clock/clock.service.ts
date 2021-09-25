import { Injectable } from '@nestjs/common';
import { interval, Observable } from 'rxjs';

@Injectable()
export class ClockService {

    date:Date = new Date("2021-09-30T12:00");
    tick = interval(100000000);
    updateTick = this.tick.subscribe((_)=>this.doTick())

    getTick():Observable<number>{
        return this.tick;
    }
    
    doTick() {
        this.date.setHours(this.date.getHours()+1);
    }

    getDate():Date{
        return this.date;
    }

}
