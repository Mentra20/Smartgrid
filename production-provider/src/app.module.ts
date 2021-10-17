import { Module } from '@nestjs/common';
import { DetailedProductionService } from './detailed-production.service';
import { DetailedProductionController } from './detailed-production.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PRODUCTION_PROVIDER',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'production-provider',
            brokers: ['kafka:9092'],
          },
        }
      },
    ]),
    ConfigModule.forRoot(),
  ],
  controllers: [DetailedProductionController],
  providers: [DetailedProductionService],
})
export class AppModule {}
