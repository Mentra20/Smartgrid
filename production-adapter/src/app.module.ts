import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductionAdaptController } from './controllers/production-adapt/production-adapt.controller';
import { ProductionAdaptService } from './services/production-adapt/production-adapt.service';
import {ProductionAdapter} from './production-adapter'
@Module({
  imports: [ClientsModule.register([
    {
      name: 'PRODUCTION_ADAPTER',
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'production-adapter',
          brokers: ['kafka:9092'],
        },
        consumer: {
          groupId: 'production-adapter',
          allowAutoTopicCreation: true,
        }
      }
    },
  ]),,
  TypeOrmModule.forFeature([ProductionAdapter]),
  TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'database',
    port: 5432,
    username: 'SI5-SOA',
    password: 'SI5-SOA',
    database: 'SI5-SOA',
    entities: [ProductionAdapter],
    synchronize: true,
  }),
  HttpModule,
],
  controllers: [ProductionAdaptController],
  providers: [ProductionAdaptService],
})
export class AppModule {}
