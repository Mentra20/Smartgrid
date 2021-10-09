import { Body, Controller, HttpCode, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { AbstractHouseObject, BasicHouseObject, ScheduledHouseObject } from 'src/models/house-object';
import { HousesService } from 'src/services/houses/houses.service';
import { Response } from 'express'
import { HouseObjectPipe } from 'src/pipes/house-object.pipe';
@Controller('house-editor')
export class HouseEditorController {

    constructor(private housesService:HousesService){

    }

    @Post("add-house")
    public addHouse(@Body() house:string){
        return this.housesService.addNewHouse(house);
    }

    @Post(":id_house/add-object")
    public addObject(@Param("id_house") houseId:string, @Body("object",new HouseObjectPipe()) object:AbstractHouseObject,@Res() res: Response){
        var currentHouse = this.housesService.getHouse(houseId);
        if(!currentHouse){
            res.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).send();
            return;
        }
        currentHouse.addHouseObject(Object.assign(BasicHouseObject,object))
    }

    @Post(":id_house/basic-object/:object/enabled")
    public enabledObject(@Param("id_house") houseId:string,@Param("object_name") objectName:string, @Body("enabled") enabled:boolean,@Res() res: Response){
        var currentHouse = this.housesService.getHouse(houseId);
        var currentObject = currentHouse?.getObject(objectName)
        if(!currentHouse ||!currentObject){
            res.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).send();
            return;
        }
        if(!(currentObject instanceof BasicHouseObject)){
            res.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).send();
            return ;
        }
        else{
            currentObject.setEnabled(enabled);
        }
    }

    @Post(":id_house/scheduled-object/:object_name/requestTimeSlot")
    public needSchedulObject(@Param("id_house") houseId:string,@Param("object_name") objectName:string, @Res() res: Response){
        var currentHouse = this.housesService.getHouse(houseId);
        var currentObject = currentHouse?.getObject(objectName)
        if(!currentHouse ||!currentObject){
            res.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).send();
            return;
        }
        if(currentObject instanceof ScheduledHouseObject){
            return this.housesService.requestTimeSLot(currentObject);
        }
        else{
            res.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).send();
            return ;
        }

    }

    @Post(":id_house/:object_name/consumption")
    public changeConsumption(@Param("id_house") houseId:string,@Param("object_name") objectName:string, @Body("consumption") consumption:number,@Res() res: Response){
        var currentHouse = this.housesService.getHouse(houseId);
        var currentObject = currentHouse?.getObject(objectName);
        if(!currentHouse ||!currentObject){
            res.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).send();
            return;
        }
        currentObject.changeMaxConsumption(consumption);
    }
}
