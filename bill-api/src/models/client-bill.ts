export class ClientBill {
    private houseID:string
    private production:number
    private consumption:number

    private productionPrice:number
    private consumptionPrice:number

    private calculedConsumptionPrice:number
    private calculedProductionPrice:number

    private finalPrice : number

    constructor(houseID:string,consumption:number,production=0){
        this.houseID = houseID;
        this.consumption = consumption;
        this.production = production;
    }

    
    public calculeBill(productionPrice,consumptionPrice){
        this.consumptionPrice=consumptionPrice;
        this.productionPrice=productionPrice;
        this.calculedConsumptionPrice = this.consumption * consumptionPrice;
        this.calculedProductionPrice = this.production * consumptionPrice;
        this.finalPrice = this.calculedConsumptionPrice-this.calculedProductionPrice
    }
}
