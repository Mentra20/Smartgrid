import { Injectable } from '@nestjs/common';


@Injectable()
export class ProductionService {
    private production: number;

    constructor() {
        this.production = 200;
    }

    onModuleInit(){
        var EventSource = require("eventsource");
        var source = new EventSource('http://clock:3004/clock/tick');

        source.onmessage = ({ data }) => {
            console.log('New message', JSON.parse(data));
        }
    }

    getProduction(): number{
        return this.production;
    }
}
