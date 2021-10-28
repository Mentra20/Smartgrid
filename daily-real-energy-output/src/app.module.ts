import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DailyRealEnergyOutputController } from './controllers/daily-real-energy-output/daily-real-energy-output.controller';
import { DailyRealEnergy } from './models/DailyRealEnergy';
import { DailyRealEnergyOutputService } from './services/daily-real-energy-output/daily-real-energy-output.service';

@Module({
  imports: [ClientsModule.register([
    {
      name: 'DAILY_REAL_ENERGY_OUTPUT',
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'daily-real-energy-output',
          brokers: ['kafka:9092'],
        },
        consumer: {
          groupId: 'daily-real-energy-output',
          allowAutoTopicCreation: true,
        }
      }
    },
  ]),
  TypeOrmModule.forFeature([DailyRealEnergy]),
  TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'database',
    port: 5432,
    username: 'SI5-SOA',
    password: 'SI5-SOA',
    database: 'SI5-SOA',
    entities: [DailyRealEnergy],
    synchronize: true,
  }),],
  controllers: [DailyRealEnergyOutputController],
  providers: [DailyRealEnergyOutputService],
})
export class AppModule {}
