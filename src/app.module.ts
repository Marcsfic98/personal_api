import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { DietModule } from './diet/diet.module';
import { Diet } from './diet/entities/diet.entity';
import { Meal } from './meal/entities/meal.entity';
import { MealModule } from './meal/meal.module';
import { MealItem } from './mealItem/entities/mealItem.entity';
import { MealItemModule } from './mealItem/mealItem.module';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';
import { UserWorkoutSession } from './userWorkoutSession/entities/userWorkoutSession.entity';
import { UserWorkoutSessionModule } from './userWorkoutSession/userWorkoutSession.module';
import { WorkoutDay } from './workoutDay/entities/workoutDay.entity';
import { WorkoutDayModule } from './workoutDay/workoutDay.module';
import { WorkoutExercice } from './workoutExercice/entities/workoutExercice.entity';
import { WorkoutExerciceModule } from './workoutExercice/workoutExercice.module';
import { WorkoutPlan } from './workoutPlan/entities/workoutPlan.entity';
import { WorkoutPlanModule } from './workoutPlan/workoutPlan.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'db_personal',
      entities: [
        WorkoutPlan,
        WorkoutDay,
        WorkoutExercice,
        UserWorkoutSession,
        Diet,
        Meal,
        MealItem,
        User,
      ],
      synchronize: true,
      logging: true,
    }),
    WorkoutPlanModule,
    WorkoutDayModule,
    WorkoutExerciceModule,
    UserWorkoutSessionModule,
    DietModule,
    MealModule,
    MealItemModule,
    AuthModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
