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
import { WorkoutPlan } from '../entities/workoutPlan.entity';
import { WorkoutPlanService } from '../service/workoutPlan.service';

@Controller('/workout_plan')
export class WorkoutPlanController {
  constructor(private readonly workoutPlanService: WorkoutPlanService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.workoutPlanService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id', ParseIntPipe) id: number): Promise<WorkoutPlan> {
    return await this.workoutPlanService.findById(id);
  }

  @Get('/name/:name')
  @HttpCode(HttpStatus.OK)
  async findByName(@Param('name') name: string): Promise<WorkoutPlan[]> {
    return await this.workoutPlanService.findByName(name);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() workoutPlan: WorkoutPlan): Promise<WorkoutPlan> {
    return await this.workoutPlanService.create(workoutPlan);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  async update(@Body() workoutPlan: WorkoutPlan): Promise<WorkoutPlan> {
    return await this.workoutPlanService.update(workoutPlan);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.workoutPlanService.delete(id);
  }
}
