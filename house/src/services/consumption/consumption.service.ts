import { Injectable } from '@nestjs/common';


@Injectable()
export class ConsumptionService {
    private consumption: number;

    constructor() {
        this.consumption = 200;
    }

    getConsumption(): number{
        return this.consumption;
    }
}
