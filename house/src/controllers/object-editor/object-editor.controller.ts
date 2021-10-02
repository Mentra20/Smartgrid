import { Body, Controller, Post } from '@nestjs/common';
import { HouseObject } from 'src/models/house-object';
import { ObjectManagerService } from 'src/services/object-manager/object-manager.service';

@Controller('object-editor')
export class ObjectEditorController {

    constructor(private houseObjectService:ObjectManagerService){}


    @Post("add-scheduled")
    addScheduledHouseObject(@Body("name") name:string, @Body("consumption") consumption:number){
        console.log("scheduled object add")
        this.houseObjectService.addScheduledHouseObject(name,consumption);
    }

    @Post("add-basic")
    addHouseObject(@Body("houseObject") houseObject:HouseObject){
        this.houseObjectService.addHouseObject(houseObject);
    }

}

