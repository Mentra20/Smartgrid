import { Body, Controller, ParseIntPipe } from '@nestjs/common';
import { BillService } from 'src/services/bill/bill.service';

@Controller('mock-cron')
export class MockCronController {
    constructor(private billService:BillService){}

    //fonction mock par le scenario mais peut etre appeler par un cron en debut de chaque mois pour calculer les facture
    //du mois precedent
    generateAllBill(@Body("year",ParseIntPipe) year:number,@Body("month",ParseIntPipe)month :number){
        this.billService.generateAllBill(year,month);
    }

}
