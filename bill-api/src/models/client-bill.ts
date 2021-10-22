import { Column, Entity, PrimaryColumn } from "typeorm"

@Entity()
export class ClientBill {
    @PrimaryColumn()
    private houseID:string
    @PrimaryColumn({type:"integer"})
    private year:number
    @PrimaryColumn({type:"integer"})
    private month:number

    @Column()
    private production:number
    @Column()
    private consumption:number

    @Column()
    private productionPrice:number
    @Column()
    private consumptionPrice:number

    @Column()
    private calculedConsumptionPrice:number
    @Column()
    private calculedProductionPrice:number

    @Column()
    private finalPrice : number

    constructor(houseID:string,year:number,month:number,consumption:number,production=0){
        this.year = year;
        this.month = month
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
