import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class HouseEnergyOutput {
  @PrimaryGeneratedColumn()
  id:number

  @Column({ nullable: true })
  clientID: string | null;

  @Column({ nullable: true })
  producerID: string | null;

  @Column()
  realEnergyOutputDate: Date;

  @Column({ nullable: true })
  communityID: number;

  @Column('double precision')
  realEnergyOutput: number;
}
