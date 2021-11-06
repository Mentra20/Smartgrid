import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class AutarkyOversightService {
  private housesAutarky;
  private communitiesAutarky;

  constructor(@Inject('AUTARKY-OVERSIGHT') private client: ClientKafka,
  ) {
    this.communitiesAutarky = {};
    this.housesAutarky = {};
  }

  processAutarky(realConsumptionCommunityMSG: {
    communityID: number;
    houses: {
      house: {
        clientID: string;
        realEnergyOutput: number;
      };
    }[];
  }) {
    this.checkSwitchAutarkyHouses(realConsumptionCommunityMSG.houses)
    this.checkSwitchAutarkyCommunity(realConsumptionCommunityMSG)
  }

  checkSwitchAutarkyCommunity(community){
    var sumEnergy = community.houses.reduce((houseContainer,acc)=>acc + Number(houseContainer.house.realEnergyOutput),0)

    var CommunityIsInAutarkyLastStep = this.communitiesAutarky[community.communityID]||false
    var CommunityIsInAutarky = sumEnergy >= 0

    if (CommunityIsInAutarkyLastStep!=CommunityIsInAutarky) {
      console.log(`precedent community autarky was ${CommunityIsInAutarkyLastStep} actual house community is ${CommunityIsInAutarky} for community ${community.communityID}`);
      this.communitiesAutarky[community.communityID]=CommunityIsInAutarky
      var message = {type: 'Community',id: community.communityID,autarky: CommunityIsInAutarky}
      console.log('message : \n', JSON.stringify(message));
      this.client.emit('client.notification', message);
    }
  }

  checkSwitchAutarkyHouses(houses){
    houses.forEach((houseContainer) => {
      this.checkSwitchAutarkyHouse(houseContainer.house)
    })
  }

  checkSwitchAutarkyHouse(house){
    var houseIsInAutarkyLastStep = this.housesAutarky[house.clientID]||false
    var houseIsInAutarky = house.realEnergyOutput >= 0

    if (houseIsInAutarkyLastStep!=houseIsInAutarky) {
      console.log(`precedent house autarky was ${houseIsInAutarkyLastStep} actual house autarky is ${houseIsInAutarky} for house ${house.clientID}`);
      this.housesAutarky[house.clientID]=houseIsInAutarky
      var message = {type: 'House',id: house.clientID,autarky: houseIsInAutarky}
      console.log('message : \n', JSON.stringify(message));
      this.client.emit('client.notification', message);
    }
  }
}
