import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule,Transport } from '@nestjs/microservices';
import { DailyConsumptionService } from './daily-consumption/daily-consumption.service';
import { DailyConsumptionController } from './daily-consumption/daily-consumption.controller';
import { DailyConsumption } from './models/daily-consumption';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'DAILY_CONSUMPTION_DB',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'daily-consumption-db',
            brokers: ['kafka:9092'],
          },
          consumer: {
            groupId: 'daily-consumption-db',
            allowAutoTopicCreation: true,
          }
        }
      },
    ]),
    TypeOrmModule.forFeature([DailyConsumption]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'database',
      port: 5432,
      username: 'SI5-SOA',
      password: 'SI5-SOA',
      database: 'SI5-SOA',
      entities: [DailyConsumption],
      synchronize: true,
    }),
  ],
  controllers: [DailyConsumptionController],
  providers: [DailyConsumptionService],
})
export class AppModule {}
