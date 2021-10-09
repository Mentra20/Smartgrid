import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConsumptionService } from './services/consumption/consumption.service';
import { ConsumptionController } from './controllers/consumption/consumption.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HouseConsumption } from './models/house-consumption';

@Module({
  imports: [
    TypeOrmModule.forFeature([HouseConsumption]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'SI5-SOA',
      password: 'SI5-SOA',
      database: 'SI5-SOA',
      entities: [HouseConsumption],
      synchronize: true,
    }),
  ],
  controllers: [AppController, ConsumptionController],
  providers: [AppService, ConsumptionService],
})
export class AppModule {}
