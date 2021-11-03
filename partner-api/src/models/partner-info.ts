import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class PartnerInfo {

    @PrimaryColumn()
    id_partner: string;

    @Column()
    dataPoint: number;

    @Column()
    trustLevel: string;
}
