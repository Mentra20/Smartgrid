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
        return this.clockService.getTick().pipe(map((_)=>({data:this.clockService.getDate()} as MessageEvent)));
    } 
}
