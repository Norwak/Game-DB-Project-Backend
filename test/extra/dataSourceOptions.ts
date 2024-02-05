import 'dotenv/config'
import { DataSourceOptions } from "typeorm";

export const dataSourceOptions: DataSourceOptions = {
  type: "sqlite",
  database: process.env.DEV_DB_NAME,
  dropSchema: true,
  entities: ['**/*.entity.ts'],
  synchronize: true,
  logging: false,
}