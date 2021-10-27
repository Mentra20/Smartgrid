import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class ProductionAdapter {

    @PrimaryColumn()
    id_producer: string;

    @PrimaryColumn()
    productionDate: Date;
    
    @Column("double precision")
    productionLimit: number;

    @Column("double precision")
    production: number;
}
