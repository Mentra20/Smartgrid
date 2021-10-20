import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class HouseAutarky {
  @PrimaryColumn()
  clientID: string;

  @Column()
  producerID: string;

  @PrimaryColumn()
  autarkyDate: Date;

  @Column()
  communityID: number;

  @Column('double precision')
  totalConsumption: number;
}
