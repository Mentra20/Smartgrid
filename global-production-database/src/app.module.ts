import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductionService } from './services/production/production.service';
import { GlobalProductionController } from './controllers/production/production.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Production} from './models/production';
import { HttpModule } from '@nestjs/axios';
import { ClientsModule, Transport } from '@nestjs/microservices';
@Module({
  imports: [
      HttpModule,
      TypeOrmModule.forFeature([Production]),
      TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'database',
      port: 5432,
      username: 'SI5-SOA',
      password: 'SI5-SOA',
      database: 'SI5-SOA',
      entities: [Production],
      synchronize: true,
      logger:'debug'
    }),
    ClientsModule.register([
      {
        name: 'GLOBAL_PRODUCTION_DB',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'global-production-database',
            brokers: ['kafka:9092'],
          },
          consumer: {
            groupId: 'global-production-database',
            allowAutoTopicCreation: true,
          }
        }
      },
    ])
  ],
  controllers: [AppController, GlobalProductionController],
  providers: [AppService, ProductionService],
})
export class AppModule {}
