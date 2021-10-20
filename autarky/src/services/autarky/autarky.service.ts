import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HouseAutarky } from 'src/models/house-autarky';
import { Repository, Between } from 'typeorm';

@Injectable()
export class AutarkyService {
  constructor(
    @InjectRepository(HouseAutarky)
    private houseAutarkyRepository: Repository<HouseAutarky>,
  ) {}

  public async addClientConsumptionToDB(clientConsumption: {
    houseID: string;
    consumptionDate: string;
    consumption: number;
  }) {
    const houseAutarky = await this.houseAutarkyRepository.findOne({
      where: {
        clientID: clientConsumption.houseID,
      },
    });
    if (houseAutarky != null) {
      const updateHouseAutarky = await this.houseAutarkyRepository.findOne({
        where: {
          clientID: clientConsumption.houseID,
          autarkyDate: new Date(clientConsumption.consumptionDate),
        },
      });
      if (updateHouseAutarky != null) {
        updateHouseAutarky.totalConsumption -= clientConsumption.consumption;
        await this.houseAutarkyRepository.save(updateHouseAutarky);
      } else {
        const newHouseAutarky = houseAutarky;
        newHouseAutarky.totalConsumption = -clientConsumption.consumption;
        newHouseAutarky.autarkyDate = new Date(
          clientConsumption.consumptionDate,
        );
        await this.houseAutarkyRepository.save(newHouseAutarky);
      }
    }
  }

  public getHouseConsumptionByDate(date: Date, clientID: string) {
    //It's unique
    return this.houseAutarkyRepository.findOne({
      where: {
        clientID: clientID,
        autarkyDate: Between(
          new Date(date.getTime() - 1000),
          new Date(date.getTime() + 1000),
        ),
      },
    });
  }

  async getCommunityAutarkyByDate(date: Date, communityID: number) {
    const housesAutarky: HouseAutarky[] =
      await this.houseAutarkyRepository.find({
        where: {
          communityID: communityID,
          autarkyDate: Between(
            new Date(date.getTime() - 1000),
            new Date(date.getTime() + 1000),
          ),
        },
      });
    let autarky = 0;
    housesAutarky.forEach((house) => (autarky += house.totalConsumption));
  }

  async addProductionToDB(productionReceived: {
    id_producer: string;
    productionDate: string;
    production: number;
  }) {
    const houseAutarky = await this.houseAutarkyRepository.findOne({
      where: {
        producerID: productionReceived.id_producer,
      },
    });
    if (houseAutarky != null) {
      const updateHouseAutarky = await this.houseAutarkyRepository.findOne({
        where: {
          clientID: houseAutarky.clientID,
          autarkyDate: new Date(productionReceived.productionDate),
        },
      });
      if (updateHouseAutarky != null) {
        updateHouseAutarky.totalConsumption += productionReceived.production;
        await this.houseAutarkyRepository.save(updateHouseAutarky);
      } else {
        const newHouseAutarky = houseAutarky;
        newHouseAutarky.totalConsumption = productionReceived.production;
        newHouseAutarky.autarkyDate = new Date(
          productionReceived.productionDate,
        );
        await this.houseAutarkyRepository.save(newHouseAutarky);
      }
    }
  }
}
