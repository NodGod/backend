import "reflect-metadata";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import { Organiser } from "./entity/Organiser";
import { Item } from "./entity/Item";
import { OrganisedEvent } from "./entity/Event";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: process.env.DB_PASSWORD || "root",
  database: "event_inventory",
  synchronize: true,
  logging: false,
  entities: [
    OrganisedEvent,
    Item,
    Organiser
  ],
  migrations: [],
  subscribers: [],
});
