import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkoutExerciceController } from './controller/workoutExercice.controller';
import { WorkoutExercice } from './entities/workoutExercice.entity';
import { WorkoutExerciceService } from './service/workoutExercice.service';

@Module({
  imports: [TypeOrmModule.forFeature([WorkoutExercice])],
  controllers: [WorkoutExerciceController],
  providers: [WorkoutExerciceService],
})
export class WorkoutExerciceModule {}
