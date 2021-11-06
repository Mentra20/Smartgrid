import { Body, Controller, Get, HttpCode, HttpStatus, Logger, Param, Post, Res } from '@nestjs/common';
import { AbstractHouseObject, BasicHouseObject, ScheduledHouseObject } from 'src/models/house-object';
import { HousesService } from 'src/services/houses/houses.service';
import { Response } from 'express'
import { HouseObjectPipe } from 'src/pipes/house-object.pipe';
import { House } from 'src/models/house';
import { Battery } from 'src/models/battery';
import { randomUUID } from 'crypto';
@Controller('house-editor')
export class HouseEditorController {
    logger = new Logger(HouseEditorController.name)

    constructor(private housesService:HousesService){

    }

    @Post("add-house")
    public async addHouse(@Body('client_name') clientName:string){
        console.log("[HouseEditorController][addHouse] Param : clientname="+clientName)
        var clientId= await this.housesService.registryNewClient(clientName,true,true,true);//TODO récupérer les privacys
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

    @Post("house/:id_house/add-battery")
    public addBatteryForHouse(@Param("id_house") houseId:string,@Body("battery") battery:any){
        var newBattery = new Battery();
        newBattery.batteryName = battery.batteryName||"battery_default"
        newBattery.batteryID = battery.batteryID||randomUUID()
        newBattery.maxProductionFlowW = battery.maxProductionFlowW?+battery.maxProductionFlowW:50
        newBattery.maxStorageFlowW = battery.maxStorageFlowW?+battery.maxStorageFlowW:50
        newBattery.capacityWH = battery.capacityWH?+battery.capacityWH:1000
        newBattery.currentStorageWH = battery.currentStorageWH?+battery.capacityWH:0

        var currentHouse = this.housesService.getHouse(houseId);
        if(!currentHouse){
            this.logger.error(`cannot found house: ${houseId}`)
            return
        }

        while(currentHouse.getBattery(newBattery.batteryID)!=undefined){
            this.logger.error(`battery id "${newBattery.batteryID}" already use for this house, new id generate`)
            newBattery.batteryID = randomUUID()
        }
        this.housesService.registerNewBattery(newBattery,currentHouse.getProducerId())
        currentHouse.addBattery(newBattery);

        this.logger.debug(`New battery add for house ${houseId} : ${JSON.stringify(newBattery)}`)
        return newBattery.batteryID;
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

    @Post("house/:id_house/all-battery")
    public getAllBattery(@Body("id_house") houseId:string){
        var currentHouse = this.housesService.getHouse(houseId);
        if(!currentHouse){
            this.logger.error(`cannot found house: ${houseId}`)
            return
        }

        var result = currentHouse.getAllBattery();
        this.logger.debug(`all battery for house ${houseId} : ${JSON.stringify(result)}`)
        return result;
    }


}
