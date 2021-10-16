import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Production {

    @PrimaryColumn()
    id_producer: string;

    @PrimaryColumn()
    productionDate: Date;

    @Column("double precision")
    production: number;
}
