import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    ManyToMany,
    JoinTable,
  } from "typeorm";
  import { Organiser } from './Organiser';
  export enum UserType {
    Member,
    Admin
  }
  
  @Entity()
  export class User {
    @PrimaryGeneratedColumn({ type: "bigint" })
    id: number;
  
    @Column()
    name: string;
  
    @Column()
    surname: string;
  
    @Column()
    email: string;
  
    @Column()
    password: string;
  
    @Column({ type: "enum", enum: UserType })
    type: UserType;

    @Column()
    approved: Boolean

    @Column()
    token: string;
  
    @ManyToOne(() => Organiser, organiser => organiser.members, {
      nullable: true,
    })
    organisation: Organiser;
  }
  