import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { HouseEnergyOutput } from 'src/models/house-energy-output';
import { RealEnergyOutputService } from 'src/services/realEnergyOutput/real-energy-output.service';

@Controller('realEnergyOutput')
export class RealEnergyOutputController {
  constructor(
    private readonly realEnergyOutputService: RealEnergyOutputService,
    @Inject('REAL-ENERGY-OUTPUT') private client: ClientKafka,
  ) {}

  async onModuleInit() {
    this.client.subscribeToResponseOf('consumption.client');
    this.client.subscribeToResponseOf('production.raw.global');
    await this.client.connect();
    console.log('RealEnergyOutput connected to the bus.');
  }

  @MessagePattern('consumption.client')
  async addClientConsumptionToDB(@Payload() totalClientConsumptionMSG: any) {
    const clientConsumption: {
      houseID: string;
      consumptionDate: string;
      consumption: number;
    } = totalClientConsumptionMSG.value;

    console.log(
      'RealEnergyOutput received this client consumption from Kafka' +
        clientConsumption.houseID +
        ' consumption from Kafka : ' +
        JSON.stringify(clientConsumption),
    );

    await this.realEnergyOutputService.addClientConsumptionToDB(
      clientConsumption,
    );
  }

  @MessagePattern('production.raw.global')
  async addClientProductionToDB(@Payload() totalProductionMSG: any) {
    const productionReceived: {
      id_producer: string;
      productionDate: string;
      production: number;
    } = totalProductionMSG.value;

    console.log(
      'RealEnergyOutput received this production from Kafka : ' +
        JSON.stringify(productionReceived),
    );

    await this.realEnergyOutputService.addProductionToDB(productionReceived);

    console.log('new production added');
  }

  @Get('get-house-real-energy-output')
  async getHouseRealEnergyOutput(
    @Query('date') date: string,
    @Query('clientID') clientID: string,
  ) {
    const houseRealEnergyOutput: HouseEnergyOutput =
      await this.realEnergyOutputService.getHouseConsumptionByDate(
        new Date(date),
        clientID,
      );
    console.log(
      '[get-house-real-energy-output][getHouseRealEnergyOutput] Get date : ' +
        new Date(date) +
        ' and client ID ' +
        clientID,
    );

    console.log(
      'house real-energy-output of ID +' +
        clientID +
        ' at date ' +
        date +
        ' is ' +
        houseRealEnergyOutput.realEnergyOutput +
        ' W.',
    );

    return houseRealEnergyOutput.realEnergyOutput;
  }

  @Get('get-community-real-energy-output')
  async getCommunityRealEnergyOutput(
    @Query('date') dateStr: string,
    @Query('communityID') communityID: number,
  ) {
    const date = new Date(dateStr);
    console.log(
      '[get-community-real-energy-output][getCommunityRealEnergyOutput] Get date : ' +
        date +
        ' and community ID ' +
        communityID,
    );

    const realEnergyOutput =
      await this.realEnergyOutputService.getCommunityRealEnergyOutputByDate(
        date,
        communityID,
      );

    console.log(
      'community real-energy-output at date ' +
        date +
        ' is ' +
        realEnergyOutput +
        ' W.',
    );

    return realEnergyOutput;
  }

  @Post('tick')
  public async doTick(@Body('date') dateString: string) {
    const date: Date = new Date(dateString);
    const messages =
      await this.realEnergyOutputService.getRealConsumptionByCommunity(date);
    messages.forEach((message) => {
      console.log('message : \n', JSON.stringify(message));
      this.client.emit('energy.output.community', message);
    });
  }
}
