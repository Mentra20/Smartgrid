import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

import { HousesService } from './services/houses/houses.service';
import { HouseEditorController } from './controllers/house-editor/house-editor.controller';
import { ManageSchedulObjectController } from './controllers/manage-schedul-object/manage-schedul-object.controller';
import { TickController } from './controllers/tick/tick.controller';

@Module({
  imports: [
      HttpModule,
      ConfigModule.forRoot(),
      ],
  controllers: [
      HouseEditorController,
      ManageSchedulObjectController,
      TickController, 
      ],
  providers: [
      HousesService,
      ],
})
export class AppModule {}
