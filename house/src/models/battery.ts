import { max } from "rxjs"
const TICK_BY_HOURE = 60
export class Battery {
    batteryID:string
    batteryName:string
    capacityWH:number
    maxProductionFlowW:number
    maxStorageFlowW:number
    currentStorageWH:number

    chargeBattery(flowW:number){
        var maxFlow = Math.min((this.currentStorageWH-this.capacityWH)*TICK_BY_HOURE,this.maxStorageFlowW,flowW)
        if(maxFlow>0){
            this.currentStorageWH += (maxFlow)/TICK_BY_HOURE
        }
        return maxFlow
    }

    useChargeOfBattery(flowW:number){
        var maxFlow = Math.min(this.currentStorageWH*TICK_BY_HOURE,this.maxProductionFlowW,flowW)
        if(maxFlow>0){
            this.currentStorageWH -= (maxFlow)/TICK_BY_HOURE
        }
        return maxFlow
    }
}
