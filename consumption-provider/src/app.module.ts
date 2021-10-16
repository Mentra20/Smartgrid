import { Module } from '@nestjs/common';
import { ClientsModule,Transport } from '@nestjs/microservices';
import { PushConsumptionController } from './push-consumption.controller';
import { PushConsumptionService } from './push-consumption.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'CONSUMPTION_PROVIDER',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'consumption-provider',
            brokers: ['kafka:9092'],
          },
        }
      },
    ]),
  ],
  controllers: [PushConsumptionController],
  providers: [PushConsumptionService],
})
export class AppModule {}
