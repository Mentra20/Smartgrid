import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class BatteryInfo {

    @PrimaryColumn()
    id_producer: string;

    @PrimaryColumn()
    id_battery: string;

    @Column("double precision")
    capacity: number;

    @Column("double precision")
    max_production_flow: number;

    @Column("double precision")
    max_storage_flow: number;

    @Column()
    active: boolean;
}
