import "reflect-metadata";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import { Organiser } from "./entity/Organiser";
import { Item } from "./entity/Item";
import { OrganisedEvent } from "./entity/Event";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_DATABASE || "event_inventory",
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
