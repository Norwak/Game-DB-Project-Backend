import { DataSourceOptions } from "typeorm";

export const dataSourceOptions: DataSourceOptions = {
  type: "sqlite",
  database: "test.sqlite",
  dropSchema: true,
  entities: ['**/*.entity.ts'],
  synchronize: true,
  logging: false,
}