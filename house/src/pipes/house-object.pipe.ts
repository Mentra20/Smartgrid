import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { AbstractHouseObject, BasicHouseObject, ScheduledHouseObject } from 'src/models/house-object';

@Injectable()
export class HouseObjectPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata):AbstractHouseObject {
    if(value.type=="BASIC"){
      var object = new BasicHouseObject(value.object.name,value.object.maxConsumption);
      object.setEnabled(value.object.enabled);
      return object
    }
    else if(value.type == "SCHEDULED"){
      var scheduledHouseObject = new ScheduledHouseObject(value.name,value.maxConsumption);
      return scheduledHouseObject;
    }
    
    throw new BadRequestException('Validation failed');
  }
}
