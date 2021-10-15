import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class HouseConsumption {

    @PrimaryColumn()
    houseID: string;

    @PrimaryColumn()
    consumptionDate: Date;

    @Column("double precision")
    totalConsumption: number;
}
