import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class EnergyParserPipe implements PipeTransform {
  transform(valueMSG: {value:{
    communityID: number,
    date: string,
    houses: {
      house: {
        clientID: string,
        producerID: string,
        realEnergyOutput: string
      }
    }[]};
  }, metadata: ArgumentMetadata): {
    id_community: number,
    id_client: string,
    id_producer: string,
    date: Date,
    energy: number
  }[] {
    const value = valueMSG.value
    var objectParse = []

    for (var houseContainer of value.houses) {
      var house = houseContainer.house
      objectParse.push(
        { 
          id_client:house.clientID,
          id_community:value.communityID?+value.communityID:0,
          id_producer:house.producerID,
          date:new Date(value.date),
          energy:house.realEnergyOutput?+house.realEnergyOutput:0
        }
      )
    }

    return objectParse;
  }
}
