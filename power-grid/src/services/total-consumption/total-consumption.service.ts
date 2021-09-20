import { Injectable } from '@nestjs/common';

@Injectable()
export class TotalConsumptionService {
    private total_consumption: number;

    constructor() {
        this.total_consumption = 600;
    }

    getTotalConsumption(): number {
        return this.total_consumption;
    }
}