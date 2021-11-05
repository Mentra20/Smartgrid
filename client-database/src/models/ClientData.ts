import {Entity, PrimaryColumn, Column} from "typeorm";

@Entity()
export class ClientData {

    @PrimaryColumn()
    id: string;

    @Column()
    privacyDetailedData: boolean;

    @Column()
    privacyConsumptionData: boolean;

    @Column()
    privacyProductionData: boolean;
}
