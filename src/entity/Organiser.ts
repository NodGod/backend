import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, ManyToMany } from 'typeorm';
import { OrganisedEvent } from './Event';
import { User } from './User';

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

  @OneToMany(() => User, user => user.organisation)
  members: User[]

}
