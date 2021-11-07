import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class ProductionAdapter {

    @PrimaryColumn()
    id_producer: string;

    
    @Column({type:"double precision",nullable:true})
    productionLimit: number;


    @Column({type:"double precision",nullable:true})
    lastProductionReceive: number;

    /**
     * Quand on demande d'adapter la production, on fait attention
     * que la demande ne seras pas instantaner
     */
     @Column({type:"double precision",nullable:true})
     lastProductionRequestToProducer: number;
}
