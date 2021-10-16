import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConsumptionPeakController } from './controllers/consumption-peak/consumption-peak.controller';
import { ConsumptionPeakService } from './services/consumption-peak/consumption-peak.service';
import { ConsumptionCheckController } from './controllers/consumption-check/consumption-check.controller';
import { ConsumptionCheckService } from './services/consumption-check/consumption-check.service';
import { HttpModule } from '@nestjs/axios';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ElectricityFrameModule } from './electricity-frame/electricity-frame.module';

@Module({
  imports: [HttpModule,
    ClientsModule.register([
    {
      name: 'CONSUMPTION_VERIFIER',
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'consumption-verifier',
          brokers: ['kafka:9092'],
        },
        consumer: {
          groupId: 'consumption-verifier',
          allowAutoTopicCreation: true,
          sessionTimeout: 30000,
          
        }
      }
    },
  ]),
    ElectricityFrameModule,],
  controllers: [AppController, ConsumptionPeakController, ConsumptionCheckController],
  providers: [AppService, ConsumptionPeakService, ConsumptionCheckService],
})
export class AppModule {}
