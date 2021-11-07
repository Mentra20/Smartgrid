import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetailedConsumption } from './models/detailed-consumption';
import { DetailedConsumptionService } from './services/detailed-consumption/detailed-consumption.service';
import { DetailedConsumptionController } from './controllers/detailed-consumption/detailed-consumption.controller';
import { ClientsModule,Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'CONSUMPTION_DETAILED',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'consumption-detailed',
            brokers: ['kafka:9092'],
          },
          consumer: {
            groupId: 'consumption-detailed',
            allowAutoTopicCreation: true,
          }
        }
      },
    ]),
    TypeOrmModule.forFeature([DetailedConsumption]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'database',
      port: 5432,
      username: 'SI5-SOA',
      password: 'SI5-SOA',
      database: 'SI5-SOA',
      entities: [DetailedConsumption],
      synchronize: true,
    }),
  ],
  controllers: [DetailedConsumptionController],
  providers: [DetailedConsumptionService],
})
export class AppModule {}
