import { Controller, Get, Query } from '@nestjs/common';
import { HouseConsumptionService } from 'src/services/house-consumption/house-consumption.service';

@Controller('house-consumption')
export class HouseConsumptionController {
    constructor(private readonly houseConsumptionService: HouseConsumptionService) {}

    @Get()
    getHouseConsumption(@Query('date') dateString:string, @Query('ID') houseID:number): Promise<number> {
        console.log(dateString+":"+houseID)
        var date = new Date(dateString);

        return this.houseConsumptionService.getHouseConsumption(date, houseID);
    }
}
