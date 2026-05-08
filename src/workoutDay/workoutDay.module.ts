import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkoutDayController } from './controller/workoutDay.controller';
import { WorkoutDay } from './entities/workoutDay.entity';
import { WorkoutDayService } from './service/workoutDay.service';

@Module({
  imports: [TypeOrmModule.forFeature([WorkoutDay])],
  controllers: [WorkoutDayController],
  providers: [WorkoutDayService],
})
export class WorkoutDayModule {}
