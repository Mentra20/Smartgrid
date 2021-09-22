import { Controller, Get, Sse, MessageEvent } from '@nestjs/common';
import { interval, map, Observable } from 'rxjs';

@Controller('clock')
export class ClockController {

    @Get()
    GetTime() : string {
        return Date().toString();
    }

    @Sse('tick')
    sse(): Observable<MessageEvent> {
        return interval(1000)
        .pipe(
            map((_) => ({ data: { hello: 'world' } } as MessageEvent))
        );
    } 
}
