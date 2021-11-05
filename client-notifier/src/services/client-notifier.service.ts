import { Injectable } from '@nestjs/common';

@Injectable()
export class ClientNotifierService {
  private houseMessages = [];
  private communityMessages = [];

  addMessage(autarkyChangeMSG: { type: string; id: any; autarky: boolean }) {
    if (autarkyChangeMSG.type == 'House') {
      this.houseMessages[autarkyChangeMSG.id] = autarkyChangeMSG;
    } else {
      this.communityMessages[autarkyChangeMSG.id] = autarkyChangeMSG;
    }
  }

  getHouseMessage(clientID: string) {
    return this.houseMessages[clientID];
  }

  getCommunityMessage(communityID: number) {
    return this.communityMessages[communityID];
  }
}
