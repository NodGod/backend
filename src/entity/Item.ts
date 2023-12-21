import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { OrganisedEvent } from './Event';

@Entity()
export class Item {
  @PrimaryGeneratedColumn({type : "bigint"})
  id: number;

  @Column()
  name: string;

  @Column()
  quantity: number;

  @Column()
  price: number;

  @ManyToOne(() => OrganisedEvent, event => event.items, {onDelete: 'CASCADE'})
  event: OrganisedEvent;
}
