import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductionService } from './services/production/production.service';
import { ProductionController } from './controllers/production/production.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Production} from './models/production';

@Module({
  imports: [
    TypeOrmModule.forFeature([Production]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5532,
      username: 'SI5-SOA',
      password: 'SI5-SOA',
      database: 'SI5-SOA',
      entities: [Production],
      synchronize: true,
    }),
  ],
  controllers: [AppController, ProductionController],
  providers: [AppService, ProductionService],
})
export class AppModule {}
