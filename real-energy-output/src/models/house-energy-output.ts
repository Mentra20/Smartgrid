import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class HouseEnergyOutput {
  @PrimaryColumn()
  clientID: string;

  @Column({ nullable: true })
  producerID: string | null;

  @PrimaryColumn()
  realEnergyOutputDate: Date;

  @Column()
  communityID: number;

  @Column('double precision')
  realEnergyOutput: number;
}
