import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkoutDay } from './workoutDay/entities/workoutDay.entity';
import { WorkoutDayModule } from './workoutDay/workoutDay.module';
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
      entities: [WorkoutPlan, WorkoutDay],
      synchronize: true,
      logging: true,
    }),
    WorkoutPlanModule,
    WorkoutDayModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
