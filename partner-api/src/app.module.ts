import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule,Transport } from '@nestjs/microservices';
import { PartnerApiService } from './partner-api/partner-api.service';
import { PartnerApiController } from './partner-api/partner-api.controller';
import { PartnerInfo } from './models/partner-info';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PARTNER_API',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'partner-api',
            brokers: ['kafka:9092'],
          },
          consumer: {
            groupId: 'partner-api',
            allowAutoTopicCreation: true,
          }
        }
      },
    ]),
    TypeOrmModule.forFeature([PartnerInfo]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'database',
      port: 5432,
      username: 'SI5-SOA',
      password: 'SI5-SOA',
      database: 'SI5-SOA',
      entities: [PartnerInfo],
      synchronize: true,
    }),
    HttpModule,
  ],
  controllers: [PartnerApiController],
  providers: [PartnerApiService],
})
export class AppModule {}
