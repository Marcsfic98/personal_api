import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkoutPlan } from './entities/workoutPlan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WorkoutPlan])],
  providers: [],
  controllers: [],
})
export class WorkoutPlanModule {}
