import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Client } from 'src/models/Client';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ClientRegistryService {

    constructor(
        @InjectRepository(Client)
        private clientRepository: Repository<Client>){}

    async getClient(clientID:number):Promise<Client> {
        return await this.clientRepository.findOne(clientID);
    }

    async getAllClients():Promise<Client[]> {
        return await this.clientRepository.find();
    }

    async getCommunity(communityID:number):Promise<Client[]> {
        return await this.clientRepository.find({id_community: communityID});
    }

    async subscribeClient(clientName:string, communityID:number):Promise<number>{
        return await this.generateClientSubscription(clientName, communityID);
    }

    async updateClientSubscription(idClient:number, newClientName:string){
        let client = await this.clientRepository.findOne(idClient);
        client.clientName = newClientName;

        await this.clientRepository.save(client);

        console.log("Client " + client.clientName + " updated.\n");
        return;
    }

    private async generateClientSubscription(clientName:string, communityID:number): Promise<number> {
        let client = new Client();
        client.clientName = clientName;
        client.id_community = communityID;

        await this.clientRepository.save(client);

        var ID_House = client.id;
        
        console.log("Saved " + client.clientName + 
        " client.\nID is " + client.id + 
        ".\nCommunity ID is " + client.id_community + ".");
        return ID_House;
    }
}
