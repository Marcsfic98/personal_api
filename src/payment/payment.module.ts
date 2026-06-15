import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { WorkoutPlan } from '../workoutPlan/entities/workoutPlan.entity';

import { PaymentController } from './controller/payment.controller';
import { PaymentService } from './service/payment.service';
import { ExpirationTask } from './tesks/expiration.task';

@Module({
  imports: [
    // Injeta as entidades necessárias para o TypeORM neste módulo
    TypeOrmModule.forFeature([User, WorkoutPlan]),
  ],
  controllers: [PaymentController],
  providers: [PaymentService, ExpirationTask],
  exports: [PaymentService],
})
export class PaymentModule {}
