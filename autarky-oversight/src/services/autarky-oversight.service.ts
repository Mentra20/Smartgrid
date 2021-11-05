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
    const messages: { type: string; id: any; autarky: boolean }[] = [];
    let communityAutarky = 0;
    realConsumptionCommunityMSG.houses.forEach((house) => {
      if (this.housesAutarky[house.house.clientID] != undefined) {
        console.log(
          'precedent house autarky was ' +
            this.housesAutarky[house.house.clientID],
          'actual house autarky is ' + (house.house.realEnergyOutput >= 0),
        );
        if (
          this.housesAutarky[house.house.clientID] &&
          !(house.house.realEnergyOutput >= 0)
        ) {
          console.log('message in queue for house :' + house.house.clientID);
          messages.push({
            type: 'House',
            id: house.house.clientID,
            autarky: false,
          });
        }
        if (
          !this.housesAutarky[house.house.clientID] &&
          house.house.realEnergyOutput >= 0
        ) {
          console.log('message in queue for house :' + house.house.clientID);
          messages.push({
            type: 'House',
            id: house.house.clientID,
            autarky: true,
          });
        }
      }
      console.log(
        'new house autarky is ' + (house.house.realEnergyOutput >= 0),
      );
      this.housesAutarky[house.house.clientID] =
        house.house.realEnergyOutput >= 0;
      communityAutarky += house.house.realEnergyOutput;
    });
    if (
      this.communitiesAutarky[realConsumptionCommunityMSG.communityID] !=
      undefined
    ) {
      console.log(
        'precedent community autarky was ' +
          this.communitiesAutarky[realConsumptionCommunityMSG.communityID],
        'actual community autarky is ' + (communityAutarky >= 0),
      );
      if (
        this.communitiesAutarky[realConsumptionCommunityMSG.communityID] &&
        !(communityAutarky >= 0)
      ) {
        console.log(
          'message in queue for community :' +
            realConsumptionCommunityMSG.communityID,
        );
        messages.push({
          type: 'Community',
          id: realConsumptionCommunityMSG.communityID,
          autarky: false,
        });
      }
      if (
        !this.communitiesAutarky[realConsumptionCommunityMSG.communityID] &&
        communityAutarky >= 0
      ) {
        console.log(
          'message in queue for community :' +
            realConsumptionCommunityMSG.communityID,
        );
        messages.push({
          type: 'Community',
          id: realConsumptionCommunityMSG.communityID,
          autarky: true,
        });
      }
    }
    console.log('new community autarky is ' + (communityAutarky >= 0));
    this.communitiesAutarky[realConsumptionCommunityMSG.communityID] =
      communityAutarky >= 0;
    return messages;
  }
}
