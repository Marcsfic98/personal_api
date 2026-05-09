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

import { WorkoutExercice } from '../../workoutExercice/entities/workoutExercice.entity';
import { WorkoutExerciceService } from '../service/workoutExercice.service';

@Controller('/workout_exercice')
export class WorkoutExerciceController {
  constructor(
    private readonly workoutExerciceService: WorkoutExerciceService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.workoutExerciceService.findAll();
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<WorkoutExercice> {
    return await this.workoutExerciceService.findById(id);
  }

  @Get('/name/:name')
  @HttpCode(HttpStatus.OK)
  async findByName(@Param('name') name: string): Promise<WorkoutExercice[]> {
    return await this.workoutExerciceService.findByName(name);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() workoutExercice: WorkoutExercice,
  ): Promise<WorkoutExercice> {
    return await this.workoutExerciceService.create(workoutExercice);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  async update(
    @Body() workoutExercice: WorkoutExercice,
  ): Promise<WorkoutExercice> {
    return await this.workoutExerciceService.update(workoutExercice);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.workoutExerciceService.delete(id);
  }
}
