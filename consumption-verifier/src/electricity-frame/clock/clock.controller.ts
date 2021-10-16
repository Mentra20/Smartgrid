import { Controller, Get, Post } from '@nestjs/common';
import { ElectricityFrameService } from '../electricity-frame.service';


/**
 * mock time for scenario
 */
@Controller('electricity-frame/clock')
export class ClockController {

    constructor(private service:ElectricityFrameService){
    }

    @Post('tick')
    doTick(date:string){
        this.service.doTick(new Date(date))
    }
}
