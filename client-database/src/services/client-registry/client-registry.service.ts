import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Client } from 'src/models/Client';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientData } from 'src/models/ClientData';

@Injectable()
export class ClientRegistryService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(ClientData)
    private clientDataRepository: Repository<ClientData>,
  ) {}

  async getClientWithClientID(houseID: string): Promise<Client> {
    return await this.clientRepository.findOne(houseID);
  }

  async getClientWithProducerID(producerID: string): Promise<Client> {
    return await this.clientRepository.findOne({
      where: { id_producer: producerID },
    });
  }

  async getAllClients(): Promise<Client[]> {
    return await this.clientRepository.find();
  }

  async getCommunity(communityID: number): Promise<Client[]> {
    return await this.clientRepository.find({
      where: { id_community: communityID },
    });
  }

  async subscribeClient(
    clientName: string,
    communityID: number,
    privacyDetailedData:boolean, 
    privacyConsumptionData:boolean, 
    privacyProductionData:boolean
  ): Promise<string> {
    return await this.generateClientSubscription(clientName, communityID, privacyDetailedData, privacyConsumptionData, privacyProductionData);
  }

  async updateClientNameinDB(idClient: string, newClientName: string) {
    const client = await this.clientRepository.findOne(idClient);
    client.clientName = newClientName;

    await this.clientRepository.save(client);

    console.log('Client ' + client.id + "'s name updated.\n");
    return;
  }

  async updateClientProducerIDinDB(idClient: string, producerID: string) {
    const client = await this.clientRepository.findOne(idClient);
    client.id_producer = producerID;

    await this.clientRepository.save(client);
    console.log('Client ' + client.id + "'s producer ID updated.\n");
    return;
  }

  private async generateClientSubscription(
    clientName: string,
    communityID: number,
    privacyDetailedData:boolean, 
    privacyConsumptionData:boolean, 
    privacyProductionData:boolean
  ): Promise<string> {
    const client = new Client();
    client.clientName = clientName;
    client.id_community = communityID;

    await this.clientRepository.save(client);

    const ID_House = client.id;
    const clientData = new ClientData();
    clientData.id = ID_House;
    clientData.privacyDetailedData = privacyDetailedData;
    clientData.privacyConsumptionData = privacyConsumptionData;
    clientData.privacyProductionData = privacyProductionData;

    await this.clientDataRepository.save(clientData);

    console.log(
      'Saved ' +
        client.clientName +
        ' client.\nID is ' +
        client.id +
        '.\nCommunity ID is ' +
        client.id_community +
        '. Client privacy choice are : privacy detailed data = ' + 
        clientData.privacyDetailedData +
        ', privacy consumption data = ' +
        clientData.privacyConsumptionData +
        ', privacy production data = ' +
        clientData.privacyProductionData,
    );
    return ID_House;
  }
}
