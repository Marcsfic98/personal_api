import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Post,
    Put,
} from '@nestjs/common';
import { MealItem } from '../entities/mealItem.entity';
import { MealItemService } from '../service/mealItem.service';

@Controller('/meal_item')
export class MealItemController {
  constructor(private readonly mealItemService: MealItemService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<MealItem[]> {
    return await this.mealItemService.findAll();
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id', ParseIntPipe) id: number): Promise<MealItem> {
    return await this.mealItemService.findById(id);
  }

  @Get('/name/:name')
  @HttpCode(HttpStatus.OK)
  async findByName(@Param('name') name: string): Promise<MealItem[]> {
    return await this.mealItemService.findByName(name);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() MealItem: MealItem): Promise<MealItem> {
    return await this.mealItemService.create(MealItem);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  async update(@Body() MealItem: MealItem): Promise<MealItem> {
    return await this.mealItemService.update(MealItem);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.mealItemService.delete(id);
  }
}
