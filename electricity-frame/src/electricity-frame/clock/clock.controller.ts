import { Body, Controller, Get, Post } from '@nestjs/common';
import { ElectricityFrameService } from '../electricity-frame.service';


/**
 * mock time for scenario
 */
@Controller('clock')
export class ClockController {

    constructor(private service:ElectricityFrameService){
    }

    @Post('tick')
    doTick(@Body('date') date:string){
        console.log('receive '+date)
        this.service.doTick(new Date(date))
    }
}
