import { UserWorkoutSessionService } from './service/userWorkoutSession.service';
import { UserWorkoutSessionController } from './controller/userWorkoutSession.controller';
import { UserWorkoutSession } from './entities/userWorkoutSession.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([UserWorkoutSession])],
  controllers: [UserWorkoutSessionController],
  providers: [UserWorkoutSessionService],
})
export class UserWorkoutSessionModule {}
