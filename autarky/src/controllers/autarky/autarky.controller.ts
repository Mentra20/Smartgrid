import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { HouseAutarky } from 'src/models/house-autarky';
import { AutarkyService } from 'src/services/autarky/autarky.service';

@Controller('autarky')
export class AutarkyController {
  constructor(
    private readonly autarkyService: AutarkyService,
    @Inject('AUTARKY') private client: ClientKafka,
  ) {}

  async onModuleInit() {
    this.client.subscribeToResponseOf('consumption.client');
    this.client.subscribeToResponseOf('production.raw.global');
    await this.client.connect();
    console.log('Autarky connected to the bus.');
  }

  @MessagePattern('consumption.client')
  async addClientConsumptionToDB(@Payload() totalClientConsumptionMSG: any) {
    const clientConsumption: {
      houseID: string;
      consumptionDate: string;
      consumption: number;
    } = totalClientConsumptionMSG.value;

    console.log(
      'Autarky received this client consumption from Kafka' +
        clientConsumption.houseID +
        ' consumption from Kafka : ' +
        JSON.stringify(clientConsumption),
    );

    await this.autarkyService.addClientConsumptionToDB(clientConsumption);
  }

  @MessagePattern('production.raw.global')
  async addClientProductionToDB(@Payload() totalProductionMSG: any) {
    const productionReceived: {
      id_producer: string;
      productionDate: string;
      production: number;
    } = totalProductionMSG.value;

    console.log(
      'Autarky received this production from Kafka : ' +
        JSON.stringify(productionReceived),
    );

    await this.autarkyService.addProductionToDB(productionReceived);

    console.log('new production added');
  }

  @Get('get-house-autarky')
  async getHouseAutarky(
    @Query('date') date: string,
    @Query('clientID') clientID: string,
  ) {
    const houseAutarky: HouseAutarky =
      await this.autarkyService.getHouseConsumptionByDate(
        new Date(date),
        clientID,
      );
    console.log(
      '[get-house-autarky][getHouseAutarky] Get date : ' +
        new Date(date) +
        ' and client ID ' +
        clientID,
    );

    console.log(
      'house autarky of ID +' +
        clientID +
        ' at date ' +
        date +
        ' is ' +
        houseAutarky.totalConsumption +
        ' W.',
    );

    return houseAutarky.totalConsumption;
  }

  @Get('get-community-autarky')
  async getCommunityAutarky(
    @Query('date') dateStr: string,
    @Query('communityID') communityID: number,
  ) {
    const date = new Date(dateStr);
    console.log(
      '[get-community-autarky][getCommunityAutarky] Get date : ' +
        date +
        ' and community ID ' +
        communityID,
    );

    const autarky = await this.autarkyService.getCommunityAutarkyByDate(
      date,
      communityID,
    );

    console.log('community autarky at date ' + date + ' is ' + autarky + ' W.');

    return autarky;
  }
}
