import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { HouseEnergyOutput } from './models/house-energy-output';
import { RealEnergyOutputController } from './controllers/realEnergyOutput/real-energy-output.controller';
import { RealEnergyOutputService } from './services/realEnergyOutput/real-energy-output.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([HouseEnergyOutput]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'database',
      port: 5432,
      username: 'SI5-SOA',
      password: 'SI5-SOA',
      database: 'SI5-SOA',
      entities: [HouseEnergyOutput],
      synchronize: true,
    }),
    ClientsModule.register([
      {
        name: 'REAL-ENERGY-OUTPUT',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'real-energy-output',
            brokers: ['kafka:9092'],
          },
          consumer: {
            groupId: 'real-energy-output',
            allowAutoTopicCreation: true,
          },
        },
      },
    ]),
    HttpModule,
  ],
  controllers: [RealEnergyOutputController],
  providers: [RealEnergyOutputService],
})
export class AppModule {}
