import { Injectable } from '@nestjs/common';
import { Scenario1Service } from './scenario1.service';
import { Scenario2Service } from './scenario2.service';

@Injectable()
export class ScenarioManagerService {
    constructor(
        private readonly scenarioHouse: Scenario1Service,
        private readonly scenarioPowerGrid: Scenario2Service){}
  
    async onModuleInit(){
        //Ajouter les scenarios ici et les lancer avec LaunchScenario

        console.log("----- Scenario house -----");
        await this.scenarioHouse.LaunchScenario();

        console.log("\n\n");

        console.log("----- Scenario power grid -----");
        await this.scenarioPowerGrid.LaunchScenario();
    }
}
