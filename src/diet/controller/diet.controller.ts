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
import { Diet } from '../entities/diet.entity';
import { DietService } from '../service/diet.service';

@Controller('/diet')
export class DietController {
  constructor(private readonly dietService: DietService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<Diet[]> {
    return await this.dietService.findAll();
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id', ParseIntPipe) id: number): Promise<Diet> {
    return await this.dietService.findById(id);
  }

  @Get('/name/:name')
  @HttpCode(HttpStatus.OK)
  async findByName(@Param('name') name: string): Promise<Diet[]> {
    return await this.dietService.findByName(name);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() diet: Diet): Promise<Diet> {
    return await this.dietService.create(diet);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  async update(@Body() diet: Diet): Promise<Diet> {
    return await this.dietService.update(diet);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.dietService.delete(id);
  }
}
