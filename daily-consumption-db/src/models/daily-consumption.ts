import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class DailyConsumption {

    @PrimaryColumn()
    houseID: string;

    @PrimaryColumn()
    dailyDate: Date;
    
    @Column("double precision")
    consumptionWH: number;
}
