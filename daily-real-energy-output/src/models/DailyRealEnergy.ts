import {Entity, PrimaryColumn, Column} from "typeorm";

@Entity()
export class DailyRealEnergy {

    @PrimaryColumn()
    id_client: string;

    @PrimaryColumn()
    id_producer: string;

    @PrimaryColumn()
    dailyDate: Date;

    @Column()
    id_community: number;

    @Column('double precision')
    energy: number;
}
