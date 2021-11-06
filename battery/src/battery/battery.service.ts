import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BatteryInfo } from 'src/models/battery-info';
import { BatteryState } from 'src/models/battery-state';
import { Repository } from 'typeorm';

@Injectable()
export class BatteryService {

    constructor(
        @InjectRepository(BatteryInfo)
        private batteryInfoRepository: Repository<BatteryInfo>,
        @InjectRepository(BatteryState)
        private batteryStateRepository: Repository<BatteryState>){}

    public addNewBatteryToDB(batteryReceived:{
        id_producer:string, 
        id_battery:string, 
        capacity:number,
        max_production_flow:number,
        max_storage_flow:number,
    }){
        var batteryInfo:BatteryInfo = new BatteryInfo();

        batteryInfo.id_producer = batteryReceived.id_producer;
        batteryInfo.id_battery = batteryReceived.id_battery;
        batteryInfo.capacity = +batteryReceived.capacity;
        batteryInfo.max_production_flow = +batteryReceived.max_production_flow;
        batteryInfo.max_storage_flow = +batteryReceived.max_storage_flow;
        batteryInfo.active = true;

        this.batteryInfoRepository.save(batteryInfo);
        console.log("New battery stored in DB : "+JSON.stringify(batteryInfo));
    }

    public storedNewBatteryStateInDB(batteryStateReceived:{
        id_producer:string, 
        id_battery:string, 
        date:string,
        current_storage:string
    }){
        var batteryState:BatteryState = new BatteryState();

        batteryState.id_producer = batteryStateReceived.id_producer;
        batteryState.id_battery = batteryStateReceived.id_battery;
        batteryState.date = new Date(batteryStateReceived.date);
        batteryState.current_storage = +batteryStateReceived.current_storage;

        this.batteryStateRepository.save(batteryState);
        console.log("New battery state stored in DB : "+JSON.stringify(batteryState));
    }

    public async getBatteryState(date:Date,producerID:string,batteryID:string){
        return await this.batteryStateRepository.findOne({where:
            {
                id_producer:producerID, 
                date: date, 
                id_battery:batteryID
            }});
    }

    public async getBatteryInfo(producerID:string,batteryID:string){
        return await this.batteryInfoRepository.findOne({where:
            {
                id_producer:producerID, 
                id_battery:batteryID
            }});
    }
}
