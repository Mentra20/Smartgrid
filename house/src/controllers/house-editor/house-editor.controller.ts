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
    public async becomeProducer(@Param("id_house") houseId:string) : Promise<string>{
        console.log("[HouseEditorController][becomeProducer] Param : houseId="+houseId)

        var house= this.housesService.getHouse(houseId);
        if(house.getProducerId()){
            return;
        }
        var producerId = await this.housesService.registryNewProducter(house.getHouseId());
        house.setProducerId(producerId);
        console.log("[HouseEditorController][becomeProducer] return : houseId="+producerId)
        return producerId;
    }


    @Post("house/:id_house/add-object")
    public addObject(@Param("id_house") houseId:string, @Body("",new HouseObjectPipe()) object:AbstractHouseObject){
        console.log(`[HouseEditorController][addObject] Param : ${JSON.stringify({houseId,object})}`)
        var currentHouse = this.housesService.getHouse(houseId);
        if(!currentHouse){
            return;
        }
        currentHouse.addHouseObject(object)
        console.log("[HouseEditorController][addObject] return void")
        return
    }

    @Post("house/:id_house/basic-object/:object/enabled")
    public enabledObject(@Param("id_house") houseId:string,@Param("object_name") objectName:string, @Body("enabled") enabled:boolean){
        var currentHouse = this.housesService.getHouse(houseId);
        var currentObject = currentHouse?.getObject(objectName)
        if(!currentHouse ||!currentObject){
            return;
        }
        if(!(currentObject instanceof BasicHouseObject)){
            return ;
        }
        else{
            currentObject.setEnabled(enabled);
        }
    }


    @Post("house/:id_house/:object_name/consumption")
    public changeConsumption(@Param("id_house") houseId:string,@Param("object_name") objectName:string, @Body("consumption") consumption:number){
        var currentHouse = this.housesService.getHouse(houseId);
        var currentObject = currentHouse?.getObject(objectName);
        if(!currentHouse ||!currentObject){
            return;
        }
        currentObject.changeMaxConsumption(consumption);
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
