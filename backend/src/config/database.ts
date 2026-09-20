import "reflect-metadata";

import { DataSource } from "typeorm";

import { env } from "./env.js";

export const AppDataSource = new DataSource({
  type: "postgres",

  url: env.databaseUrl,

  ssl: {
    rejectUnauthorized: false,
  },

  synchronize: false,

  logging: false,

  schema: "twofa_demo",

  migrationsTableName: "twofa_migrations",

  entities: ["src/entities/*.ts"],

  migrations: ["src/migrations/*.ts"],
});