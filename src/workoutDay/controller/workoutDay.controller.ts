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
import { WorkoutDay } from '../entities/workoutDay.entity';
import { WorkoutDayService } from '../service/workoutDay.service';

@Controller('/workout_day')
export class WorkoutDayController {
  constructor(private readonly workoutDayService: WorkoutDayService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.workoutDayService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id', ParseIntPipe) id: number): Promise<WorkoutDay> {
    return await this.workoutDayService.findById(id);
  }

  @Get('/name/:name')
  @HttpCode(HttpStatus.OK)
  async findByName(@Param('name') name: string): Promise<WorkoutDay[]> {
    return await this.workoutDayService.findByName(name);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() workoutDay: WorkoutDay): Promise<WorkoutDay> {
    return await this.workoutDayService.create(workoutDay);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  async update(@Body() workoutDay: WorkoutDay): Promise<WorkoutDay> {
    return await this.workoutDayService.update(workoutDay);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.workoutDayService.delete(id);
  }
}
