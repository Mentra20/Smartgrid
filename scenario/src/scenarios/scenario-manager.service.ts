import { Injectable } from '@nestjs/common';
import { Scenario1Service } from './scenario1.service';
import { Scenario2Service } from './scenario2.service';
import { Scenario3Service } from './scenario3.service';
import { Scenario4Service } from './scenario4.service';
@Injectable()
export class ScenarioManagerService {
    constructor(
        private readonly scenarioHouse: Scenario1Service,
        private readonly scenarioPowerGrid: Scenario2Service,
        private readonly scenarioSupplier: Scenario3Service,
        private readonly scenarioHouseObject: Scenario4Service
        ){}
  
    async onModuleInit(){
        //Ajouter les scenarios ici et les lancer avec LaunchScenario

        console.log("----- Scenario house -----");
        await this.scenarioHouse.LaunchScenario();

        console.log("\n\n");

        console.log("----- Scenario power grid -----");
        await this.scenarioPowerGrid.LaunchScenario();

        console.log("\n\n");

        console.log("----- Scenario supplier -----");
        await this.scenarioSupplier.LaunchScenarioSupplier();

        console.log("\n\n");

        console.log("----- Scenario house-object -----");
        await this.scenarioHouseObject.LaunchScenario();

        console.log("\n\n");
    }
}
