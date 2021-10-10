import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { ConsumptionService } from './services/consumption/consumption.service';
// import { ConsumptionController } from './controllers/consumption/consumption.controller';
import { HttpModule } from '@nestjs/axios';
// import { SubscribeService } from './services/subscribe/subscribe.service';
import { ConfigModule } from '@nestjs/config';
// import { ObjectManagerService } from './services/object-manager/object-manager.service';
// import { ObjectEditorController } from './controllers/object-editor/object-editor.controller';
import { HousesService } from './services/houses/houses.service';
import { HouseEditorController } from './controllers/house-editor/house-editor.controller';
import { ManageSchedulObjectController } from './controllers/manage-schedul-object/manage-schedul-object.controller';

@Module({
  imports: [
      HttpModule,
      ConfigModule.forRoot(),
      ],
  controllers: [
      AppController,
      HouseEditorController,
      ManageSchedulObjectController, 
    //   ConsumptionController,
    //   ObjectEditorController,
      ],
  providers: [
      AppService, 
    //   ConsumptionService, 
    //   SubscribeService, 
    //   ObjectManagerService, 
      HousesService,
      ],
})
export class AppModule {}
