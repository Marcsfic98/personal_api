import { UserWorkoutSession } from './userWorkoutSession/entities/userWorkoutSession.entity';
import { UserWorkoutSessionModule } from './userWorkoutSession/userWorkoutSession.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkoutDay } from './workoutDay/entities/workoutDay.entity';
import { WorkoutDayModule } from './workoutDay/workoutDay.module';
import { WorkoutExercice } from './workoutExercice/entities/workoutExercice.entity';
import { WorkoutExerciceModule } from './workoutExercice/workoutExercice.module';
import { WorkoutPlan } from './workoutPlan/entities/workoutPlan.entity';
import { WorkoutPlanModule } from './workoutPlan/workoutPlan.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'db_personal',
      entities: [WorkoutPlan, WorkoutDay, WorkoutExercice, UserWorkoutSession],
      synchronize: true,
      logging: true,
    }),
    WorkoutPlanModule,
    WorkoutDayModule,
    WorkoutExerciceModule,
    UserWorkoutSessionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
