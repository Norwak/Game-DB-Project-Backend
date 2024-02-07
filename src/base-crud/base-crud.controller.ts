import { Body, Delete, Get, Inject, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { BaseCrudService } from "./base-crud.service";
import { BaseCrudEntity } from "./entitites/base-crud.entity";
import { AdminGuard } from "../guards/admin.guard";
import { CreateBaseCrudDto } from "./dtos/create-base-crud.dto";
import { UpdateBaseCrudDto } from "./dtos/update-base-crud.dto";

export class BaseCrudController<T extends BaseCrudEntity> {
  constructor(
    @Inject('service') private service: BaseCrudService<T>
  ) {}

  @Get()
  async find(@Query('q') query: string) {
    return await this.service.find(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.service.findOne(id);
  }

  @Post()
  @UseGuards(AdminGuard)
  async create(@Body() createDeveloperDto: CreateBaseCrudDto) {
    return await this.service.create(createDeveloperDto);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  async update(@Param('id') id: number, @Body() updateDeveloperDto: UpdateBaseCrudDto) {
    return await this.service.update(id, updateDeveloperDto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  async remove(@Param('id') id: number) {
    return await this.service.remove(id);
  }
}
