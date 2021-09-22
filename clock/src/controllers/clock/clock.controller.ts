import { Controller, Get, Sse, MessageEvent } from '@nestjs/common';
import { interval, map, Observable } from 'rxjs';
import { ClockService } from 'src/services/clock/clock.service';

@Controller('clock')
export class ClockController {

    constructor(private clockService:ClockService){}

    @Get()
    GetTime() : string {
        return Date().toString();
    }


    @Sse('tick')
    sse(): Observable<MessageEvent> {
        return interval(1000)
        .pipe(
            map((_) => ({ data: this.clockService.doTick().getTime().toString() } as MessageEvent))
        );
    } 
}
