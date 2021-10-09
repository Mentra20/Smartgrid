import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Client {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    id_community: number;

    @Column("varchar",{
        length: 50
    })
    clientName: string;

}
