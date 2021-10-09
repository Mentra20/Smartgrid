import { Body, Controller, HttpCode, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { AbstractHouseObject, BasicHouseObject } from 'src/models/house-object';
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

    @Post(":id/add-object")
    public addObject(@Param("id") houseId:string, @Body("object",new HouseObjectPipe()) object:AbstractHouseObject,@Res() res: Response){
        var currentHouse = this.housesService.getHouse(houseId);
        if(!currentHouse){
            res.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).send();
            return;
        }
        currentHouse.addHouseObject(Object.assign(BasicHouseObject,object))
    }

    @Post(":id/:object/enabled")
    public enabledObject(@Param("id") houseId:string,@Param("object") objectName:string, @Body("enabled") enabled:boolean,@Res() res: Response){
        var currentHouse = this.housesService.getHouse(houseId);
        var currentObject = currentHouse?.getObject(objectName)
        if(!currentHouse ||!currentObject){
            res.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).send();
            return;
        }
        currentObject.setEnabled(enabled);
    }

    @Post(":id/:object/consumption")
    public changeConsumption(@Param("id") houseId:string,@Param("object") objectName:string, @Body("consumption") consumption:number,@Res() res: Response){
        var currentHouse = this.housesService.getHouse(houseId);
        var currentObject = currentHouse?.getObject(objectName)
        if(!currentHouse ||!currentObject){
            res.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).send();
            return;
        }
        currentObject.setConsumption(consumption);
    }
}
