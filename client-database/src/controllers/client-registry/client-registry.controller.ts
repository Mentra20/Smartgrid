import { Body, Controller, Get, Post } from '@nestjs/common';
import { Client } from 'src/models/Client';
import { ClientRegistryService } from '../../services/client-registry/client-registry.service';

@Controller('client-registry')
export class ClientRegistryController {

    constructor(private clientRegistryService: ClientRegistryService) {}

    @Get("community")
    getCommunity(@Body("communityID") communityID:number): Promise<Client[]> {
        return this.clientRegistryService.getCommunity(communityID);
    }

    @Get("house")
    getHouse(@Body("houseID") houseID:number): Promise<Client> {
        return this.clientRegistryService.getClient(houseID);
    }

    @Get("allHouses")
    getAllHouses(): Promise<Client[]> {
        return this.clientRegistryService.getAllClients();
    }
    
    @Post("subscribe")
    clientSubscribe(@Body("clientName") clientName:string, @Body("communityID") communityID:number){
        console.log("[client-registry][clientSubscribe] clientName:string "+ clientName + "=> void");
        return this.clientRegistryService.subscribeClient(clientName, communityID);
    }

    @Post("updateClientConnection")
    updateConnection(@Body("idClient") idClient:number, @Body("clientName") clientName:string) {
        return this.clientRegistryService.updateClientSubscription(idClient, clientName);
    }

}
