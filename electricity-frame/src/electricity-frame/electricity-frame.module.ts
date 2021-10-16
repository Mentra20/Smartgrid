import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ElectricityFrameService } from './electricity-frame.service';
import { ElectricityFrameController } from './electricity-frame.controller';
import { ClockController } from './clock/clock.controller';

@Module({
    imports:[ClientsModule.register([
        {
          name: 'CONSUMPTION_FRAME',
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'consumption-frame',
              brokers: ['kafka:9092'],
            },
            consumer: {
              groupId: 'consumption-frame',
              allowAutoTopicCreation: true,
              sessionTimeout: 30000,
              
            }
          }
        }
    ])
    ],
    providers:[ElectricityFrameService],
    controllers: [ElectricityFrameController, ClockController]
})
export class ElectricityFrameModule {}
