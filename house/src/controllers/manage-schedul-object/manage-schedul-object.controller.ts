import { Controller, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { HousesService } from 'src/services/houses/houses.service';
import { Response } from 'express';
import { ScheduledHouseObject } from 'src/models/house-object';

@Controller('manage-schedul-object')
export class ManageSchedulObjectController {

    constructor(private housesService:HousesService){
    }


    @Post(":id_house/scheduled-object/:object_name/requestTimeSlot")
    public needSchedulObject(@Param("id_house") houseId:string,@Param("object_name") objectName:string){
        var currentHouse = this.housesService.getHouse(houseId);
        var currentObject = currentHouse?.getObject(objectName)
        if(!currentHouse ||!currentObject){
            return;
        }
        if(currentObject instanceof ScheduledHouseObject){
            return this.housesService.requestTimeSLot(currentObject);
        }
        else{
            return ;
        }

    }


    
    @Post(":id_house/scheduled-object-stop-all")
    public stopAllScheduledObject(@Param("id_house") houseId:string,@Res() res: Response){
        var currentHouse = this.housesService.getHouse(houseId);
        if(!currentHouse){
            return;
        }
        for(var currentObjectScheduled of currentHouse.getAllObject().filter((obj)=>obj instanceof ScheduledHouseObject)){
            (<ScheduledHouseObject> currentObjectScheduled).removeCurrentTimeSlot(this.housesService.getCurrentDate());
        }

    }

}
