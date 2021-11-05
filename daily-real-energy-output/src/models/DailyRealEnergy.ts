import {Entity, PrimaryColumn, Column} from "typeorm";

@Entity()
export class DailyRealEnergy {

    @PrimaryColumn()
    id_client: string;

    @PrimaryColumn()
    dailyDate: Date;

    @Column({
        nullable: true,
        type: 'text'
    })
    id_producer: string | null;

    @Column()
    id_community: number;

    @Column('double precision')
    energy: number;
}
