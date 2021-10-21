import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class DailyProduction {

    @PrimaryColumn()
    id_producer: string;

    @PrimaryColumn()
    dailyDate: Date;
    
    @Column("double precision")
    productionWH: number;
}
