import { Test, TestingModule } from '@nestjs/testing';
import { BaseCrudService } from './base-crud.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseCrudTestEntity } from './entities/base-crud-test.entity';
import { dataSourceOptions } from '../../../test/extra/dataSourceOptions';

describe('BaseCrudService', () => {
  let baseCrudService: BaseCrudService<BaseCrudTestEntity>;
  let testingModule: TestingModule;
  let dataSource: DataSource;

  beforeEach(async () => {
    dataSource = new DataSource(dataSourceOptions);
    await dataSource.initialize();

    testingModule = await Test.createTestingModule({
      providers: [
        BaseCrudService,
        {
          provide: 'repository',
          useValue: dataSource.getRepository(BaseCrudTestEntity),
        },
      ],
    }).compile();

    baseCrudService = testingModule.get<BaseCrudService<BaseCrudTestEntity>>(BaseCrudService);
  });

  it('should be defined', () => {
    expect(baseCrudService).toBeDefined();
  });



  it('[find] should return an array of items matching search query #1', async () => {
    await baseCrudService.create({ title: 'Item #1' });

    const items = await baseCrudService.find('Item #1');
    expect(items.length).toEqual(1);
    expect(items[0].title).toEqual('Item #1');
  });

  it('[find] should return an array of items matching search query #2', async () => {
    await baseCrudService.create({ title: 'Item #1' });
    await baseCrudService.create({ title: 'Item #2' });
    await baseCrudService.create({ title: 'Test #3' });

    const items = await baseCrudService.find('item');
    expect(items.length).toEqual(2);
    expect(items[0].title).toEqual('Item #1');
    expect(items[1].title).toEqual('Item #2');
  });

  it('[find] should return an empty array if no results found', async () => {
    await baseCrudService.create({ title: 'Item #1' });
    await baseCrudService.create({ title: 'Item #2' });
    await baseCrudService.create({ title: 'Item #3' });

    const items = await baseCrudService.find('q');
    expect(items.length).toEqual(0);
  });



  it('[findSome] should return an array of items by ids', async () => {
    await baseCrudService.create({ title: 'Item #1' });
    await baseCrudService.create({ title: 'Item #2' });
    await baseCrudService.create({ title: 'Item #3' });

    const items = await baseCrudService.findSome([1, 2, 3]);
    expect(items.length).toEqual(3);
    expect(items[2].title).toEqual('Item #3');
  });

  it('[findSome] should return an empty array of items weren\'t found', async () => {
    const items = await baseCrudService.findSome([1, 2, 3]);
    expect(items.length).toEqual(0);
  });



  it('[findOne] should return an item with given id', async () => {
    const item = await baseCrudService.create({ title: 'Item #1' });
    const relations = [];

    const foundItem = await baseCrudService.findOne(item.id, relations);
    expect(foundItem.title).toEqual('Item #1');
  });

  it('[findOne] should throw a NotFoundException if item\'s id doesn\'t exist', async () => {
    const relations = [];
    await expect(baseCrudService.findOne(12514, relations)).rejects.toThrow(NotFoundException);
  });

  it('[findOne] should throw a BadRequestException if item\'s id isn\'t valid', async () => {
    const relations = [];
    await expect(baseCrudService.findOne(-15, relations)).rejects.toThrow(BadRequestException);
    await expect(baseCrudService.findOne(undefined, relations)).rejects.toThrow(BadRequestException);
  });



  it('[create] should create an item with given title and return it', async () => {
    const createdItem = await baseCrudService.create({ title: 'Item #1' });
    expect(createdItem.title).toEqual('Item #1');
  });

  it('[create] should throw a BadRequestException if item\'s name is invalid', async () => {
    await expect(baseCrudService.create({ title: '' })).rejects.toThrow(BadRequestException);
  });

  it('[create] should throw a BadRequestException if item\'s name already exists', async () => {
    await baseCrudService.create({ title: 'Item #1' });
    await expect(baseCrudService.create({ title: 'Item #1' })).rejects.toThrow(BadRequestException);
  });



  it('[update] should update an item\'s data with given ID and return updated item', async () => {
    const item = await baseCrudService.create({ title: 'TIem #1' });
    const updatedItem = await baseCrudService.update(item.id, {title: 'Item #1'});
    expect(updatedItem.title).toEqual('Item #1');
  });

  it('[update] should throw a BadRequestException if item\'s id is invalid', async () => {
    const item = await baseCrudService.create({ title: 'TIem #1' });
    await expect(baseCrudService.update(-10, { title: '' })).rejects.toThrow(BadRequestException);
  });

  it('[update] should throw a NotFoundException if item\'s id doesn\'t exist', async () => {
    await expect(baseCrudService.update(123, { title: '' })).rejects.toThrow(NotFoundException);
  });



  it('[remove] should delete an item with given ID and return it', async () => {
    const item = await baseCrudService.create({ title: 'Item #1' });
    const deletedItem = await baseCrudService.remove(item.id);
    expect(deletedItem).toBeDefined();
    expect(deletedItem.id).toEqual(undefined);
  });

  it('[remove] should throw a BadRequestException if item\'s id is invalid', async () => {
    await expect(baseCrudService.remove(undefined)).rejects.toThrow(BadRequestException);
  });

  it('[remove] should throw a NotFoundException if item\'s id doesn\'t exist', async () => {
    await expect(baseCrudService.remove(123)).rejects.toThrow(NotFoundException);
  });
});
