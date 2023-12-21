import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Organiser } from './Organiser';
import { Item } from './Item';

@Entity()
export class OrganisedEvent {
  @PrimaryGeneratedColumn({type : "bigint"})
  id: number;

  @Column()
  name: string;

  @Column({type : "text"})
  description: string;

  @Column({type : "datetime"})
  date: Date;

  @Column()
  address: string;

  @ManyToOne(() => Organiser, organiser => organiser.events, {onDelete: 'CASCADE'})
  organiser: Organiser;

  @OneToMany(() => Item, item => item.event, {cascade: true})
  items: Item[];
}
