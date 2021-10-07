import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class DetailedConsumption {

    @PrimaryColumn()
    houseID: string;

    @PrimaryColumn()
    consommationDate: Date;

    @PrimaryColumn({
        length: 100
    })
    objectName: string;

    @Column("double precision")
    consumption: number;
}
