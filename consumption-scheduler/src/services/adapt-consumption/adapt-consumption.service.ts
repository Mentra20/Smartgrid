import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AdaptConsumptionService {
  private URL_DATASERVICE_REGISTRY =
    'http://client-database:3004/client-registry/community';
  private URL_HOUSE =
    'http://house:3000/manage-schedul-object';
  constructor(private http: HttpService) {}

  postAdaptConsumption(communityID: number) {
    firstValueFrom(
      this.http.get(this.URL_DATASERVICE_REGISTRY, {
        params: { communityID: communityID },
      }),
    ).then((body) => {
      console.log("on coupe les objet plannifier des maisons : "+JSON.stringify(body.data))
      const houses: any[] = body.data;
      houses.forEach((house) =>
        this.http.post(
          this.URL_HOUSE + '/' + house.id + '/scheduled-object-stop-all',
        ).subscribe(),
      );
    });
  }
}
