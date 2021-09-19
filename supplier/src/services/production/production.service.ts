import { Injectable } from '@nestjs/common';


@Injectable()
export class ProductionService {
    private production: number;

    constructor() {
        this.production = 200;
    }

    getProduction(): number{
        return this.production;
    }
}
