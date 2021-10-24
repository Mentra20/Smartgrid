import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HouseAutarky } from 'src/models/house-autarky';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AutarkyService {
  private URL_DATASERVICE_REGISTRY_CONSUMPTION =
    'http://client-database:3004/client-registry/house';
  private URL_DATASERVICE_REGISTRY_PRODUCTION =
    'http://client-database:3004/client-registry/house-producer-id';

  constructor(
    @InjectRepository(HouseAutarky)
    private houseAutarkyRepository: Repository<HouseAutarky>,
    private http: HttpService,
  ) {}

  public async addClientConsumptionToDB(clientConsumption: {
    houseID: string;
    consumptionDate: string;
    consumption: number;
  }) {
    const houseAutarky = await this.findHouseAutarkyByClientID(
      clientConsumption.houseID,
    );
    if (houseAutarky) {
      console.log('found a line with the same client ID');
      const updateHouseAutarky = await this.findHouseAutarkyByClientIDAndDate(
        clientConsumption.houseID,
        clientConsumption.consumptionDate,
      );
      if (updateHouseAutarky) {
        console.log('found a line with the same client ID and date');
        updateHouseAutarky.autarky -= +clientConsumption.consumption;
        console.log('saving the line with -consumption');
        await this.houseAutarkyRepository.save(updateHouseAutarky);
      } else {
        console.log('creating a new line with the new date');
        await this.newHouseAutarkyByOtherDateAndConsumption(
          clientConsumption,
          houseAutarky,
        );
      }
    } else {
      console.log('asking the info to client database');
      await this.getNewHouseByHouseID(clientConsumption);
    }
  }

  async addProductionToDB(productionReceived: {
    id_producer: string;
    productionDate: string;
    production: number;
  }) {
    const houseAutarky = await this.findHouseAutarkyByProducerID(
      productionReceived.id_producer,
    );
    if (houseAutarky != null) {
      console.log('found a line with the same production ID');
      const updateHouseAutarky = await this.findHouseAutarkyByClientIDAndDate(
        houseAutarky.clientID,
        productionReceived.productionDate,
      );
      if (updateHouseAutarky != null) {
        console.log('found a line with the same client ID and date');
        updateHouseAutarky.autarky += productionReceived.production;
        console.log('saving the line with +production');
        await this.houseAutarkyRepository.save(updateHouseAutarky);
      } else {
        console.log('creating a new line with the new date');
        await this.newHouseAutarkyByOtherDateAndProduction(
          productionReceived,
          houseAutarky,
        );
      }
    } else {
      console.log('asking the info to client database');
      await this.getNewHouseByProducerID(productionReceived);
    }
  }

  public getHouseConsumptionByDate(date: Date, clientID: string) {
    //It's unique
    return this.houseAutarkyRepository.findOne({
      where: {
        clientID: clientID,
        autarkyDate: date,
      },
    });
  }

  async getCommunityAutarkyByDate(date: Date, communityID: number) {
    const housesAutarky: HouseAutarky[] =
      await this.houseAutarkyRepository.find({
        where: {
          communityID: communityID,
          autarkyDate : date
          
        },
      });
     let autarky = await housesAutarky.reduce((v1,v2)=>v1+v2.autarky,0);
    return autarky;
  }

  private async getNewHouseByHouseID(clientConsumption: {
    houseID: string;
    consumptionDate: string;
    consumption: number;
  }) {
    const newHouseAutarky = new HouseAutarky();
    await firstValueFrom(
      this.http.get(this.URL_DATASERVICE_REGISTRY_CONSUMPTION, {
        params: { houseID: clientConsumption.houseID },
      }),
    ).then((body) => {
      console.log(body.data);
      const client = body.data;
      newHouseAutarky.autarky = -clientConsumption.consumption;
      newHouseAutarky.autarkyDate = new Date(clientConsumption.consumptionDate);
      newHouseAutarky.clientID = client.id;
      newHouseAutarky.communityID = client.id_community;
      newHouseAutarky.producerID = client.id_producer;
    });
    await this.houseAutarkyRepository.save(newHouseAutarky);
  }

  private async newHouseAutarkyByOtherDateAndConsumption(
    clientConsumption: {
      houseID: string;
      consumptionDate: string;
      consumption: number;
    },
    houseAutarky: HouseAutarky,
  ) {
    const newHouseAutarky = new HouseAutarky();
    newHouseAutarky.autarky = -clientConsumption.consumption;
    newHouseAutarky.autarkyDate = new Date(clientConsumption.consumptionDate);
    newHouseAutarky.clientID = houseAutarky.clientID;
    newHouseAutarky.producerID = houseAutarky.producerID;
    newHouseAutarky.communityID = houseAutarky.communityID;
    await this.houseAutarkyRepository.save(newHouseAutarky);
  }

  private async findHouseAutarkyByClientIDAndDate(
    houseID: string,
    consumptionDate: string,
  ) {
    return await this.houseAutarkyRepository.findOne({
      where: {
        clientID: houseID,
        autarkyDate: new Date(consumptionDate),
      },
    });
  }

  private async findHouseAutarkyByClientID(houseID: string) {
    return this.houseAutarkyRepository.findOne({
      where: {
        clientID: houseID,
      },
    });
  }

  private async findHouseAutarkyByProducerID(id_producer: string) {
    return this.houseAutarkyRepository.findOne({
      where: {
        producerID: id_producer,
      },
    });
  }

  private async newHouseAutarkyByOtherDateAndProduction(
    productionReceived: {
      id_producer: string;
      productionDate: string;
      production: number;
    },
    houseAutarky: HouseAutarky,
  ) {
    const newHouseAutarky = new HouseAutarky();
    newHouseAutarky.autarky = +productionReceived.production;
    newHouseAutarky.clientID = houseAutarky.clientID;
    newHouseAutarky.producerID = houseAutarky.producerID;
    newHouseAutarky.communityID = houseAutarky.communityID;
    newHouseAutarky.autarkyDate = new Date(productionReceived.productionDate);
    await this.houseAutarkyRepository.save(newHouseAutarky);
  }

  private async getNewHouseByProducerID(productionReceived: {
    id_producer: string;
    productionDate: string;
    production: number;
  }) {
    const newHouseAutarky = new HouseAutarky();
    await firstValueFrom(
      this.http.get(this.URL_DATASERVICE_REGISTRY_PRODUCTION, {
        params: { producerID: productionReceived.id_producer },
      }),
    ).then((body) => {
      console.log(body.data);
      const client = body.data;
      newHouseAutarky.autarky = +productionReceived.production;
      newHouseAutarky.autarkyDate = new Date(productionReceived.productionDate);
      newHouseAutarky.clientID = client.id;
      newHouseAutarky.communityID = client.id_community;
      newHouseAutarky.producerID = client.id_producer;
    });
    await this.houseAutarkyRepository.save(newHouseAutarky);
  }
}
