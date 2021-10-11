import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';


@Injectable()
export class ProductionService {
    private production: number;

    constructor(private http:HttpService) {
        this.production = 200;
    }

    setProduction(value:number): number {
        console.log("Set production to :"+value);
        this.production = value;
        return this.production;
    }
}
