import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Producer {

    @PrimaryGeneratedColumn()
    id_producer: number;

    @Column()
    id_company: string;

}
