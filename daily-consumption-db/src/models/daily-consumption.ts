import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class DailyConsumption {

    @PrimaryColumn()
    houseID: string;

    @PrimaryColumn()
    dailyDate: string;
    
    @Column("double precision")
    consumptionWH: number;
}
