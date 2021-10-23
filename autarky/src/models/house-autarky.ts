import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class HouseAutarky {
  @PrimaryColumn()
  clientID: string;

  @Column({ nullable: true })
  producerID: string | null;

  @PrimaryColumn()
  autarkyDate: Date;

  @Column()
  communityID: number;

  @Column('double precision')
  autarky: number;
}
