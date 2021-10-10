import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { AbstractHouseObject, BasicHouseObject, ScheduledHouseObject } from 'src/models/house-object';
import { HousesService } from 'src/services/houses/houses.service';
import { Response } from 'express'
import { HouseObjectPipe } from 'src/pipes/house-object.pipe';
import { House } from 'src/models/house';
@Controller('house-editor')
export class HouseEditorController {

    constructor(private housesService:HousesService){

    }

    @Post("add-house")
    public async addHouse(@Body('client_name') clientName:string){
        var clientId= await this.housesService.registryNewClient(clientName);
        var newHouse = new House(clientName,clientId);
        this.housesService.addHouse(newHouse)
        return clientId;
    }

    @Post(":id_house/become-producer")
    public async becomeProducer(@Param("id_house") houseId:string,@Res() res: Response){
        var house= this.housesService.getHouse(houseId);
        if(house.getProducerId()){
            res.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).send();
            return;
        }
        var producerId = await this.housesService.registryNewProducter(house.getClientName());
        house.setProducerId(producerId);
        return producerId;
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

    @Get(":id_house/get_all_object")
    public getAllObject(@Param("id_house") houseId:string){
        return this.housesService.getHouse(houseId)?.getAllObject();
    }

    @Get(":id_house/get_all_object/scheduled")
    public getAllObjectScheduled(@Param("id_house") houseId:string){
        return this.housesService.getHouse(houseId)?.getAllObject()?.filter((value)=>value instanceof ScheduledHouseObject);
    }

    @Get(":id_house/get_all_object/basic")
    public getAllObjectBasic(@Param("id_house") houseId:string){
        return this.housesService.getHouse(houseId)?.getAllObject()?.filter((value)=>value instanceof BasicHouseObject);
    }

    @Get(":id_house/get_object/:object_name")
    public getSpecificObject(@Param("id_house") houseId:string,@Param("object_name") objectName:string){
        return this.housesService.getHouse(houseId)?.getAllObject().find((object)=>object.getName()===objectName);
    }
}
