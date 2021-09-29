import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';


@Injectable()
export class ProductionService {
    private production: number;
    private URL: string;

    constructor(private http:HttpService) {
        this.production = 200;
    }

    getProduction(): number{
        return this.production;
    }

    setProduction(value:number) {
        this.production = value;
    }
}
