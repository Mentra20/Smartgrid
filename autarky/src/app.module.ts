import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { HouseAutarky } from './models/house-autarky';
import { AutarkyController } from './controllers/autarky/autarky.controller';
import { AutarkyService } from './services/autarky/autarky.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([HouseAutarky]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'database',
      port: 5432,
      username: 'SI5-SOA',
      password: 'SI5-SOA',
      database: 'SI5-SOA',
      entities: [HouseAutarky],
      synchronize: true,
    }),
    ClientsModule.register([
      {
        name: 'AUTARKY',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'autarky',
            brokers: ['kafka:9092'],
          },
          consumer: {
            groupId: 'autarky',
            allowAutoTopicCreation: true,
          },
        },
      },
    ]),
  ],
  controllers: [AppController, AutarkyController],
  providers: [AppService, AutarkyService],
})
export class AppModule {}
