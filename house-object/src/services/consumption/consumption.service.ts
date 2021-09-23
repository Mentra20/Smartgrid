import { Injectable } from '@nestjs/common';
import { TimeSlotsList } from 'src/models/time-slots';

@Injectable()
export class ConsumptionService {

    private objectName='voiture';
    private consumptionJson:any=[
        {
            start:'2021-10-01T00:00',
            end:'2021-10-01T10:00',
            consumption: 500
        },
        {
            start:'2021-10-02T00:00',
            end:'2021-10-02T06:00',
            consumption: 600
        },
        {
            start:'2021-10-03T00:00',
            end:'2021-10-03T08:00',
            consumption: 450
        }
    ];

    private consumptionSlotList:TimeSlotsList = new TimeSlotsList(this.consumptionJson);
    


    getConsumption(date:Date):number{
        return this.consumptionSlotList.getConsumption(date);
    }

    getObjectName():string{
        return this.objectName;
    }


}
