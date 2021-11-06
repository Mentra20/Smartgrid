import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class BatteryState {

    @PrimaryColumn()
    id_producer: string;

    @PrimaryColumn()
    id_battery: string;

    @PrimaryColumn()
    date: Date;

    @Column("double precision")
    current_storage: number;
}
