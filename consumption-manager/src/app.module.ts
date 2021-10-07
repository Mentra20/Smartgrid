import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetailedConsumption } from './models/detailed-consumption';
import { AddDetailedConsumptionService } from './services/add-detailed-consumption/add-detailed-consumption.service';
import { AddDetailedConsumptionController } from './controllers/add-detailed-consumption/add-detailed-consumption.controller';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([DetailedConsumption]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'SI5-SOA',
      password: 'SI5-SOA',
      database: 'SI5-SOA',
      entities: [DetailedConsumption],
      synchronize: true,
    }),
  ],
  controllers: [AppController, AddDetailedConsumptionController],
  providers: [AppService, AddDetailedConsumptionService],
})
export class AppModule {}
