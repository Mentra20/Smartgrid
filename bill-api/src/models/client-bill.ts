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

    @Column({type:"double precision"})
    private productionPrice:number
    @Column({type:"double precision"})
    private consumptionPrice:number

    @Column({type:"double precision"})
    private calculedConsumptionPrice:number
    @Column({type:"double precision"})
    private calculedProductionPrice:number

    @Column({type:"double precision"})
    private finalPrice : number

    constructor(houseID:string,year:number,month:number,consumption:number,production=0){
        this.year = year;
        this.month = month
        this.houseID = houseID;
        this.consumption = consumption;
        this.production = production;
    }

    
    public calculeBill(productionPrice:number,consumptionPrice:number):void{
        this.consumptionPrice=consumptionPrice;
        this.productionPrice=productionPrice;
        this.calculedConsumptionPrice = this.consumption * consumptionPrice;
        this.calculedProductionPrice = this.production * consumptionPrice;
        this.finalPrice = this.calculedConsumptionPrice-this.calculedProductionPrice
    }
}
