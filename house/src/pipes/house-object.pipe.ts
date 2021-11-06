import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { AbstractHouseObject, BasicHouseObject, ScheduledHouseObject } from 'src/models/house-object';

@Injectable()
export class HouseObjectPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata):AbstractHouseObject {
    if(value.type=="BASIC"){
      return BasicHouseObject.objectFromJson(value.object)
    }
    else if(value.type == "SCHEDULED"){
      var scheduledHouseObject = new ScheduledHouseObject(value.object.name,+value.object.maxConsumption);
      return scheduledHouseObject;
    }
    
    throw new BadRequestException('Validation failed');
  }
}
