import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Url {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  original: string;

  @Column({
    type: 'text',
    unique: true,
    nullable: true,
  })
  shortened?: string;

  @Column({
    type: 'bigint',
    nullable: false,
  })
  counter?: number;

  @Column({
    type: 'integer',
    nullable: false,
    default: 0,
  })
  visits: number;
}
