import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Producer {

    @PrimaryGeneratedColumn("uuid")
    id_producer: string;

    @Column()
    id_company: string;

}
