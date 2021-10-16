import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GlobalConsumptionController } from './controllers/global-consumption/global-consumption.controller';
import { GlobalConsumptionService } from './services/global-consumption/global-consumption.service';
import { HouseConsumption } from './models/house-consumption';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [TypeOrmModule.forFeature([HouseConsumption]),
  TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'database',
    port: 5432,
    username: 'SI5-SOA',
    password: 'SI5-SOA',
    database: 'SI5-SOA',
    entities: [HouseConsumption],
    synchronize: true,
  }),
  ClientsModule.register([
    {
      name: 'GLOBAL_CONSUMPTION_DB',
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'global-consumption-database',
          brokers: ['kafka:9092'],
        },
        consumer: {
          groupId: 'global-consumption-database',
          allowAutoTopicCreation: true,
        }
      }
    },
  ]),
],
  controllers: [GlobalConsumptionController],
  providers: [GlobalConsumptionService],
})
export class AppModule {}
