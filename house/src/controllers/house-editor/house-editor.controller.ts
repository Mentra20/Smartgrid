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
        console.log("[HouseEditorController][addHouse] Param : clientname="+clientName)
        var clientId= await this.housesService.registryNewClient(clientName);
        var newHouse = new House(clientName,clientId);
        this.housesService.addHouse(newHouse)
        console.log("[HouseEditorController][addHouse] return : clientid="+clientId)
        return clientId;
    }

    @Post("house/:id_house/become-producer")
    public async becomeProducer(@Param("id_house") houseId:string,@Res() res: Response){
        console.log("[HouseEditorController][becomeProducer] Param : houseId="+houseId)

        var house= this.housesService.getHouse(houseId);
        if(house.getProducerId()){
            res.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).send();
            return;
        }
        var producerId = await this.housesService.registryNewProducter(house.getClientName());
        house.setProducerId(producerId);
        console.log("[HouseEditorController][becomeProducer] return : houseId="+producerId)
        res.status(HttpStatus.OK).send(producerId);
        return ;
    }


    @Post("house/:id_house/add-object")
    public addObject(@Param("id_house") houseId:string, @Body("",new HouseObjectPipe()) object:AbstractHouseObject,@Res() res: Response){
        console.log(`[HouseEditorController][addObject] Param : ${JSON.stringify({houseId,object})}`)
        var currentHouse = this.housesService.getHouse(houseId);
        if(!currentHouse){
            res.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).send();
            return;
        }
        currentHouse.addHouseObject(object)
        console.log("[HouseEditorController][addObject] return void")
        res.status(HttpStatus.OK).send();
        return
    }

    @Post("house/:id_house/basic-object/:object/enabled")
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
            res.status(HttpStatus.OK).send();
        }
    }


    @Post("house/:id_house/:object_name/consumption")
    public changeConsumption(@Param("id_house") houseId:string,@Param("object_name") objectName:string, @Body("consumption") consumption:number,@Res() res: Response){
        var currentHouse = this.housesService.getHouse(houseId);
        var currentObject = currentHouse?.getObject(objectName);
        if(!currentHouse ||!currentObject){
            res.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).send();
            return;
        }
        currentObject.changeMaxConsumption(consumption);
        res.status(HttpStatus.OK).send();
    }

    @Get("house/:id_house/get_all_object")
    public getAllObject(@Param("id_house") houseId:string){
        return this.housesService.getHouse(houseId)?.getAllObject();
    }

    @Get("house/:id_house/get_all_object/scheduled")
    public getAllObjectScheduled(@Param("id_house") houseId:string){
        return this.housesService.getHouse(houseId)?.getAllObject()?.filter((value)=>value instanceof ScheduledHouseObject);
    }

    @Get("house/:id_house/get_all_object/basic")
    public getAllObjectBasic(@Param("id_house") houseId:string){
        return this.housesService.getHouse(houseId)?.getAllObject()?.filter((value)=>value instanceof BasicHouseObject);
    }

    @Get("house/:id_house/get_object/:object_name")
    public getSpecificObject(@Param("id_house") houseId:string,@Param("object_name") objectName:string){
        return this.housesService.getHouse(houseId)?.getAllObject().find((object)=>object.getName()===objectName);
    }
}
