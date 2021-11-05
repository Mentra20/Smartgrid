import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PushBatteryProviderController } from './battery-provider/push-battery-provider.controller';
import { BatteryProviderService } from './battery-provider/battery-provider.service';


@Module({
  imports: [ClientsModule.register([
    {
      name: 'BATTERY_PROVIDER',
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'consumption-provider',
          brokers: ['kafka:9092'],
        },
      }
    },
  ]),],
  controllers: [PushBatteryProviderController],
  providers: [BatteryProviderService],
})
export class AppModule {}
