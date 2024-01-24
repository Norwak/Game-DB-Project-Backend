import { Repository } from "typeorm";
import { MockType } from "./mockType.type";

export const fakeRepositoryFactory: () => MockType<Repository<any>> = jest.fn(() => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
  // ...
}));