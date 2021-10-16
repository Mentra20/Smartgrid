import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConsumptionPeakController } from './consumption-peak/consumption-peak.controller';
import { ConsumptionPeakService } from './consumption-peak/consumption-peak.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'CONSUMPTION_PEAK',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'consumption-peak',
            brokers: ['kafka:9092'],
          },
          consumer: {
            groupId: 'consumption-peak',
            allowAutoTopicCreation: true,
          }
        }
      },
    ]),
  ],
  controllers: [ConsumptionPeakController],
  providers: [ConsumptionPeakService],
})
export class AppModule {}
