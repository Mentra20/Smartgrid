import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProducerRegistryService } from './services/producer-registry/producer-registry.service';
import { ProducerRegistryController } from './controllers/producer-registry/producer-registry.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producer } from './models/Producer';

@Module({
  imports: [      
    TypeOrmModule.forFeature([Producer]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'database',
      port: 5432,
      username: 'SI5-SOA',
      password: 'SI5-SOA',
      database: 'SI5-SOA',
      entities: [Producer],
      synchronize: true,
    }),
  ],
  controllers: [AppController, ProducerRegistryController],
  providers: [AppService, ProducerRegistryService],
})
export class AppModule {}
