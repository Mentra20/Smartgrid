import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { PartnerApiService } from './partner-api.service';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';

@Controller('partner-api')
export class PartnerApiController {
    constructor(private partnerService: PartnerApiService){}

    @Post("add-partner")
    addPartner(
        @Body('partnerID') partnerID:string, 
        @Body('datapoint') datapointStr:string, 
        @Body('trust-level') trustLevel:string)
    {
        console.log("[add-partner] partnerID :"+partnerID+", datapoint :"+datapoint+", trust-level :"+trustLevel)
        var datapoint = +datapointStr;
        
        this.partnerService.addPartnerToDB(partnerID, datapoint, trustLevel);
    }

    @Post("add-datapoint")
    addDatapointToPartner(@Body('partnerID') partnerID:string, @Body('datapoint') datapointStr:string){
        console.log("[add-datapoint] partnerID :"+partnerID+", datapoint :"+datapoint)

        var datapoint = +datapointStr;

        this.partnerService.addDatapointForPartner(partnerID, datapoint);
    }

    @Get("request-detailed-consumption")
    requestClientDetailedConsumption(
        @Query('partnerID') partnerID:string,
        @Query('date') dateString:string, 
    ){
        console.log("[request-detailed-consumption] partnerID :"+partnerID+", date :"+dateString);
        var date = new Date(dateString);

        return this.partnerService.requestClientsDetailedConsumptionData(partnerID,date);
    }

    @Get("request-global-consumption")
    requestClientGlobalConsumption(
        @Query('partnerID') partnerID:string,
        @Query('date') dateString:string, 
    ){
        console.log("[request-global-consumption] partnerID :"+partnerID+", date :"+dateString);
        var date = new Date(dateString);

        return this.partnerService.requestClientsGlobalConsumptionData(partnerID,date);
    }

    @Get("request-production")
    requestClientProduction(
        @Query('partnerID') partnerID:string,
        @Query('date') dateString:string, 
    ){
        console.log("[request-production] partnerID :"+partnerID+", date :"+dateString);
        var date = new Date(dateString);

        return this.partnerService.requestClientsProductionData(partnerID,date);
    }
}
