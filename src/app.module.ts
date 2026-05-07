import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
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
      entities: [WorkoutPlan],
      synchronize: true,
      logging: true,
    }),
    WorkoutPlanModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
