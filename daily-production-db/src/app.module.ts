import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule,Transport } from '@nestjs/microservices';
import { DailyProductionService } from './daily-production/daily-production.service';
import { DailyProductionController } from './daily-production/daily-production.controller';
import { DailyProduction } from './models/daily-production';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'DAILY_PRODUCTION_DB',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'daily-production-db',
            brokers: ['kafka:9092'],
          },
          consumer: {
            groupId: 'daily-production-db',
            allowAutoTopicCreation: true,
          }
        }
      },
    ]),
    TypeOrmModule.forFeature([DailyProduction]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'database',
      port: 5432,
      username: 'SI5-SOA',
      password: 'SI5-SOA',
      database: 'SI5-SOA',
      entities: [DailyProduction],
      synchronize: true,
    }),
  ],
  controllers: [DailyProductionController],
  providers: [DailyProductionService],
})
export class AppModule {}
