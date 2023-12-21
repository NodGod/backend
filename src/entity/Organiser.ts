import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { OrganisedEvent } from './Event';

@Entity()
export class Organiser {
  @PrimaryGeneratedColumn({type : "bigint"})
  id: number;

  @Column()
  name: string;

  @Column()
  phoneNumber: string;

  @Column()
  email: string;

  @OneToMany(() => OrganisedEvent, event => event.organiser, {cascade: true})
  events: OrganisedEvent[];
}
