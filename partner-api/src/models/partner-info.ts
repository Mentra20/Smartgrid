import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class PartnerInfo {

    @PrimaryColumn()
    id_partner: string;

    @Column()
    dataPoint: number;

    @Column()
    trustLevel: number;//Pour detailed : niv 3, pour prod : niv 2, pour global : niv 1
}
