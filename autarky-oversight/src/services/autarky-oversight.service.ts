import { Injectable } from '@nestjs/common';

@Injectable()
export class AutarkyOversightService {
  private housesAutarky;
  private communitiesAutarky;

  constructor() {
    this.communitiesAutarky = {};
    this.housesAutarky = {};
  }

  processAutarkyCommunity(realConsumptionCommunityMSG: {
    communityID: number;
    houses: {
      house: {
        clientID: string;
        realEnergyOutput: number;
      };
    }[];
  }) {
    const messages: { type: string; id: any }[] = [];
    let communityAutarky = 0;
    realConsumptionCommunityMSG.houses.forEach((house) => {
      if (this.housesAutarky[house.house.clientID] != undefined) {
        if (
          this.housesAutarky[house.house.clientID] &&
          !(house.house.realEnergyOutput >= 0)
        ) {
          messages.push({ type: 'House', id: house.house.clientID });
        }
      }
      this.housesAutarky[house.house.clientID] =
        house.house.realEnergyOutput >= 0;
      communityAutarky += house.house.realEnergyOutput;
    });
    if (
      this.communitiesAutarky[realConsumptionCommunityMSG.communityID] !=
      undefined
    ) {
      if (
        this.communitiesAutarky[realConsumptionCommunityMSG.communityID] &&
        !(communityAutarky >= 0)
      ) {
        messages.push({
          type: 'Community',
          id: realConsumptionCommunityMSG.communityID,
        });
      }
    }
    this.communitiesAutarky[realConsumptionCommunityMSG.communityID] =
      communityAutarky >= 0;
    return messages;
  }
}
