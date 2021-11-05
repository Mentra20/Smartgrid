import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HouseEnergyOutput } from 'src/models/house-energy-output';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RealEnergyOutputService {
  private URL_DATASERVICE_REGISTRY_CONSUMPTION =
    'http://client-database:3004/client-registry/house';
  private URL_DATASERVICE_REGISTRY_PRODUCTION =
    'http://client-database:3004/client-registry/house-producer-id';

  constructor(
    @InjectRepository(HouseEnergyOutput)
    private houseRealEnergyOutputRepository: Repository<HouseEnergyOutput>,
    private http: HttpService,
  ) {}

  public async addClientConsumptionToDB(clientConsumption: {
    houseID: string;
    consumptionDate: string;
    consumption: number;
  }) {
    const houseRealEnergyOutput =
      await this.findHouseRealEnergyOutputByClientID(clientConsumption.houseID);
    if (houseRealEnergyOutput) {
      console.log('found a line with the same client ID');
      const updateHouseRealEnergyOutput =
        await this.findHouseRealEnergyOutputByClientIDAndDate(
          clientConsumption.houseID,
          clientConsumption.consumptionDate,
        );
      if (updateHouseRealEnergyOutput) {
        console.log('found a line with the same client ID and date');
        updateHouseRealEnergyOutput.realEnergyOutput -=
          +clientConsumption.consumption;
        console.log('saving the line with -consumption');
        await this.houseRealEnergyOutputRepository.save(
          updateHouseRealEnergyOutput,
        );
      } else {
        console.log('creating a new line with the new date');
        await this.newHouseRealEnergyOutputByOtherDateAndConsumption(
          clientConsumption,
          houseRealEnergyOutput,
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
    const houseRealEnergyOutput =
      await this.findHouseRealEnergyOutputByProducerID(
        productionReceived.id_producer,
      );
    if (houseRealEnergyOutput != null) {
      console.log('found a line with the same production ID');
      const updateHouseRealEnergyOutput =
        await this.findHouseRealEnergyOutputByClientIDAndDate(
          houseRealEnergyOutput.clientID,
          productionReceived.productionDate,
        );
      if (updateHouseRealEnergyOutput != null) {
        console.log('found a line with the same client ID and date');
        updateHouseRealEnergyOutput.realEnergyOutput +=
          productionReceived.production;
        console.log('saving the line with +production');
        await this.houseRealEnergyOutputRepository.save(
          updateHouseRealEnergyOutput,
        );
      } else {
        console.log('creating a new line with the new date');
        await this.newHouseRealEnergyOutputByOtherDateAndProduction(
          productionReceived,
          houseRealEnergyOutput,
        );
      }
    } else {
      console.log('asking the info to client database');
      await this.getNewHouseByProducerID(productionReceived);
    }
  }

  public getHouseConsumptionByDate(date: Date, clientID: string) {
    //It's unique
    return this.houseRealEnergyOutputRepository.findOne({
      where: {
        clientID: clientID,
        realEnergyOutputDate: date,
      },
    });
  }

  async getCommunityRealEnergyOutputByDate(date: Date, communityID: number) {
    const housesRealEnergyOutput: HouseEnergyOutput[] =
      await this.houseRealEnergyOutputRepository.find({
        where: {
          communityID: communityID,
          realEnergyOutputDate: date,
        },
      });
    const realEnergyOutput = await housesRealEnergyOutput.reduce(
      (v1, v2) => v1 + v2.realEnergyOutput,
      0,
    );
    return realEnergyOutput;
  }

  private async getNewHouseByHouseID(clientConsumption: {
    houseID: string;
    consumptionDate: string;
    consumption: number;
  }) {
    const newHouseRealEnergyOutput = new HouseEnergyOutput();
    await firstValueFrom(
      this.http.get(this.URL_DATASERVICE_REGISTRY_CONSUMPTION, {
        params: { houseID: clientConsumption.houseID },
      }),
    ).then((body) => {
      console.log(body.data);
      const client = body.data;
      newHouseRealEnergyOutput.realEnergyOutput =
        -clientConsumption.consumption;
      newHouseRealEnergyOutput.realEnergyOutputDate = new Date(
        clientConsumption.consumptionDate,
      );
      newHouseRealEnergyOutput.clientID = client.id;
      newHouseRealEnergyOutput.communityID = client.id_community;
      newHouseRealEnergyOutput.producerID = client.id_producer;
    });
    await this.houseRealEnergyOutputRepository.save(newHouseRealEnergyOutput);
  }

  private async newHouseRealEnergyOutputByOtherDateAndConsumption(
    clientConsumption: {
      houseID: string;
      consumptionDate: string;
      consumption: number;
    },
    houseRealEnergyOutput: HouseEnergyOutput,
  ) {
    const newHouseRealEnergyOutput = new HouseEnergyOutput();
    newHouseRealEnergyOutput.realEnergyOutput = -clientConsumption.consumption;
    newHouseRealEnergyOutput.realEnergyOutputDate = new Date(
      clientConsumption.consumptionDate,
    );
    newHouseRealEnergyOutput.clientID = houseRealEnergyOutput.clientID;
    newHouseRealEnergyOutput.producerID = houseRealEnergyOutput.producerID;
    newHouseRealEnergyOutput.communityID = houseRealEnergyOutput.communityID;
    await this.houseRealEnergyOutputRepository.save(newHouseRealEnergyOutput);
  }

  private async findHouseRealEnergyOutputByClientIDAndDate(
    houseID: string,
    consumptionDate: string,
  ) {
    return await this.houseRealEnergyOutputRepository.findOne({
      where: {
        clientID: houseID,
        realEnergyOutputDate: new Date(consumptionDate),
      },
    });
  }

  private async findHouseRealEnergyOutputByClientID(houseID: string) {
    return this.houseRealEnergyOutputRepository.findOne({
      where: {
        clientID: houseID,
      },
    });
  }

  private async findHouseRealEnergyOutputByProducerID(id_producer: string) {
    return this.houseRealEnergyOutputRepository.findOne({
      where: {
        producerID: id_producer,
      },
    });
  }

  private async newHouseRealEnergyOutputByOtherDateAndProduction(
    productionReceived: {
      id_producer: string;
      productionDate: string;
      production: number;
    },
    houseRealEnergyOutput: HouseEnergyOutput,
  ) {
    const newHouseRealEnergyOutput = new HouseEnergyOutput();
    newHouseRealEnergyOutput.realEnergyOutput = +productionReceived.production;
    newHouseRealEnergyOutput.clientID = houseRealEnergyOutput.clientID;
    newHouseRealEnergyOutput.producerID = houseRealEnergyOutput.producerID;
    newHouseRealEnergyOutput.communityID = houseRealEnergyOutput.communityID;
    newHouseRealEnergyOutput.realEnergyOutputDate = new Date(
      productionReceived.productionDate,
    );
    await this.houseRealEnergyOutputRepository.save(newHouseRealEnergyOutput);
  }

  private async getNewHouseByProducerID(productionReceived: {
    id_producer: string;
    productionDate: string;
    production: number;
  }) {
    const newHouseRealEnergyOutput = new HouseEnergyOutput();
    await firstValueFrom(
      this.http.get(this.URL_DATASERVICE_REGISTRY_PRODUCTION, {
        params: { producerID: productionReceived.id_producer },
      }),
    ).then((body) => {
      console.log(body.data);
      const client = body.data;
      newHouseRealEnergyOutput.realEnergyOutput =
        +productionReceived.production;
      newHouseRealEnergyOutput.realEnergyOutputDate = new Date(
        productionReceived.productionDate,
      );
      newHouseRealEnergyOutput.clientID = client.id;
      newHouseRealEnergyOutput.communityID = client.id_community;
      newHouseRealEnergyOutput.producerID = client.id_producer;
    });
    await this.houseRealEnergyOutputRepository.save(newHouseRealEnergyOutput);
  }

  async getRealConsumptionByCommunity(date: Date) {
    date.setMinutes(date.getMinutes() - 5);
    const housesRealEnergyOutput: HouseEnergyOutput[] =
      await this.houseRealEnergyOutputRepository.find({
        where: {
          realEnergyOutputDate: date,
        },
        order: { communityID: 'ASC' },
      });
    const messages = [];
    const message: {
      communityID: number;
      houses: {
        house: {
          clientID: string;
          realEnergyOutput: number;
        };
      }[];
    } = {
      communityID: housesRealEnergyOutput[0].communityID,
      houses: [],
    };
    let currentCommunityID = housesRealEnergyOutput[0].communityID;
    housesRealEnergyOutput.forEach((house) => {
      if (house.communityID != currentCommunityID) {
        currentCommunityID = house.communityID;
        messages.push(message);
        message.communityID = currentCommunityID;
        message.houses = [];
      }
      message.houses.push({
        house: {
          clientID: house.clientID,
          realEnergyOutput: house.realEnergyOutput,
        },
      });
    });
    messages.push(message);
    return messages;
  }
}
