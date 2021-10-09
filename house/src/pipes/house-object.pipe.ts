import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { AbstractHouseObject, BasicHouseObject } from 'src/models/house-object';

@Injectable()
export class HouseObjectPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata):AbstractHouseObject {
    if(value.type=="BASIC"){
      return Object.assign(BasicHouseObject,value.object())
    }
    
    throw new BadRequestException('Validation failed');
  }
}
