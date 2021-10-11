import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Client } from 'src/models/Client';
import { ClientRegistryService } from '../../services/client-registry/client-registry.service';

@Controller('client-registry')
export class ClientRegistryController {
  constructor(private clientRegistryService: ClientRegistryService) {}

  @Get('community')
  getCommunity(@Query('communityID') communityID: number): Promise<Client[]> {
    return this.clientRegistryService.getCommunity(communityID);
  }

  @Get('house')
  getHouse(@Query('houseID') houseID: string): Promise<Client> {
    return this.clientRegistryService.getClient(houseID);
  }

  @Get('allHouses')
  getAllHouses(): Promise<Client[]> {
    return this.clientRegistryService.getAllClients();
  }

  @Post('subscribe')
  clientSubscribe(
    @Body('clientName') clientName: string,
    @Body('communityID') communityID: number,
  ): Promise<string> {
    console.log(
      '[client-registry][clientSubscribe] clientName:string ' +
        clientName +
        '=> void',
    );
    return this.clientRegistryService.subscribeClient(clientName, communityID);
  }

  @Post('updateClientConnection')
  updateConnection(
    @Body('idClient') idClient: string,
    @Body('newClientName') newClientName: string,
  ) {
    return this.clientRegistryService.updateClientSubscription(
      idClient,
      newClientName,
    );
  }
}
