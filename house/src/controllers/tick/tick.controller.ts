import { Body, Controller, Post } from '@nestjs/common';
import { HousesService } from 'src/services/houses/houses.service';

@Controller('')
export class TickController {

    constructor(private housesService:HousesService){}

    @Post("tick")
    public doTick(@Body("date") dateString:string){
        var date:Date = new Date(dateString);
        this.housesService.doTick(date);
    }
}
