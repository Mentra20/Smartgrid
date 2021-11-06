import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { DailyRealEnergy } from 'src/models/DailyRealEnergy';
import { EnergyParserPipe } from 'src/pipe/energy-parser.pipe';
import { DailyRealEnergyOutputService } from 'src/services/daily-real-energy-output/daily-real-energy-output.service';

@Controller('daily-real-energy-output')
export class DailyRealEnergyOutputController {
    
    constructor(private readonly dailyRealEnergyOutputService: DailyRealEnergyOutputService,
        @Inject("DAILY_REAL_ENERGY_OUTPUT") private client:ClientKafka) {
    }

    async onModuleInit() {
        this.client.subscribeToResponseOf("energy.output.community");
        await this.client.connect();
        console.log("Daily Real Energy Output connected to the bus.");
    }

    @MessagePattern("energy.output.community") 
    addClientRealDailyDataToDB(@Payload(EnergyParserPipe) clientRealDailyDataMSG:{
        id_community:number,
        id_client:string,
        id_producer:string,
        date:Date,
        energy:number
    }[]) {

        for(var clientRealDailyData of clientRealDailyDataMSG){
            console.log("Daily real energy output received the client " + clientRealDailyData.id_client + " data from Kafka : " + JSON.stringify(clientRealDailyData));

            this.dailyRealEnergyOutputService.addClientDataToDB(clientRealDailyData);
        }
    }

    @Get('daily-real-energy-output')
    async getDailyRealEnergyOutput(@Query('id_client') id_client:string, @Query('dataDate') dateString:string): Promise<DailyRealEnergy> {
        var dataDate = new Date(dateString);
        console.log("[DailyRealEnergyOutputController][daily-real-energy-output] params : id_client:" + id_client + " dataDate:" + dateString);
        
        var dailyEnergy = await this.dailyRealEnergyOutputService.getClientDataByDate(dataDate, id_client);
        console.log("Return daily real energy output :" + JSON.stringify(dailyEnergy));
        return dailyEnergy;
    }

    @Get('period-real-energy-output')
    async getRealEnergyOutputInGivenPeriod(@Query('id_client') id_client:string,
        @Query('begin') begin:string,
        @Query('end') end:string): Promise<DailyRealEnergy[]> {
            
        var beginDate = new Date(begin);
        var endDate = new Date(end);

        console.log("[DailyRealEnergyOutputController][period-real-energy-output] params : id_client:" + id_client + " begin:" + begin + " end:" + end);
        
        return await this.dailyRealEnergyOutputService.getClientPeriodData(beginDate, endDate, id_client);
    }
}
