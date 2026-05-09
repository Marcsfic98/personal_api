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
import { MealService } from '../service/meal.service';
import { Meal } from './../entities/meal.entity';

@Controller('/meal')
export class MealController {
  constructor(private readonly mealService: MealService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<Meal[]> {
    return await this.mealService.findAll();
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id', ParseIntPipe) id: number): Promise<Meal> {
    return await this.mealService.findById(id);
  }

  @Get('/name/:name')
  @HttpCode(HttpStatus.OK)
  async findByName(@Param('name') name: string): Promise<Meal[]> {
    return await this.mealService.findByName(name);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() meal: Meal): Promise<Meal> {
    return await this.mealService.create(meal);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  async update(@Body() meal: Meal): Promise<Meal> {
    return await this.mealService.update(meal);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.mealService.delete(id);
  }
}
