import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BatteryInfo } from './models/battery-info';
import { BatteryState } from './models/battery-state';
import { BatteryService } from './battery/battery.service';
import { BatteryController } from './battery/battery.controller';


@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'BATTERY',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'battery',
            brokers: ['kafka:9092'],
          },
          consumer: {
            groupId: 'battery',
            allowAutoTopicCreation: true,
          }
        }
      },
    ]),
    TypeOrmModule.forFeature([BatteryInfo,BatteryState]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'database',
      port: 5432,
      username: 'SI5-SOA',
      password: 'SI5-SOA',
      database: 'SI5-SOA',
      entities: [BatteryInfo,BatteryState],
      synchronize: true,
    }),
  ],
  controllers: [BatteryController],
  providers: [BatteryService],
})
export class AppModule {}
