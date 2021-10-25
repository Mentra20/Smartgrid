import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Client } from 'src/models/Client';
import { ClientRegistryService } from '../../services/client-registry/client-registry.service';

@Controller('client-registry')
export class ClientRegistryController {
  constructor(private clientRegistryService: ClientRegistryService) {}

  @Get('community')
  getCommunity(@Query('communityID') communityID: string): Promise<Client[]> {
    console.log("[ClientRegistryController][getCommunity] params: communityID:"+communityID)
    var value = this.clientRegistryService.getCommunity(+communityID);
    console.log("[ClientRegistryController][getCommunity] return: "+JSON.stringify(value))
    return value
  }

  @Get('house')
  getHouseWithClientID(@Query('houseID') houseID: string): Promise<Client> {
    return this.clientRegistryService.getClientWithClientID(houseID);
  }

  @Get('house-producer-id')
  getHouseWithProducerID(@Query('producerID') producerID: string): Promise<Client> {
    return this.clientRegistryService.getClientWithProducerID(producerID);
  }

  @Get('allHouses')
  getAllHouses(): Promise<Client[]> {
    return this.clientRegistryService.getAllClients();
  }

  @Post('subscribe')
  clientSubscribe(@Body('clientName') clientName: string, @Body('communityID') communityID: number, @Body("privacyDetailedData") privacyDetailedData:boolean, 
  @Body("privacyConsumptionData") privacyConsumptionData:boolean, @Body("privacyProductionData") privacyProductionData:boolean): Promise<string> {
    console.log(
      '[client-registry][clientSubscribe] clientName:string ' +
        clientName + ' communityID:string ' + communityID + ' privacyDetailedData:boolean ' + privacyDetailedData +
        ' privacyConsumptionData:boolean ' + privacyConsumptionData + ' privacyProductionData:boolean ' + privacyProductionData +
        ' => Promise<String>',
    );
    return this.clientRegistryService.subscribeClient(clientName, communityID, privacyDetailedData, privacyConsumptionData, privacyProductionData);
  }

  @Post('updateClientName')
  updateClientNameinDB(
    @Body('idClient') idClient: string,
    @Body('newClientName') newClientName: string,
  ) {
    return this.clientRegistryService.updateClientNameinDB(
      idClient,
      newClientName,
    );
  }

  @Post('updateClientProducerID')
  updateClientProducerIDinDB(@Body('idClient') idClient: string, @Body('producerID') producerID: string) {
    return this.clientRegistryService.updateClientProducerIDinDB(idClient, producerID);
  }
}
