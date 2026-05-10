import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkoutPlanController } from './controller/workoutPlan.controller';
import { WorkoutPlan } from './entities/workoutPlan.entity';
import { WorkoutPlanService } from './service/workoutPlan.service';

@Module({
  imports: [TypeOrmModule.forFeature([WorkoutPlan])],
  providers: [WorkoutPlanService],
  controllers: [WorkoutPlanController],
  exports: [WorkoutPlanService],
})
export class WorkoutPlanModule {}
