import { ManyToOne } from 'typeorm';
import { User } from './../../user/entities/user.entity';
import { IsBoolean, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { WorkoutDay } from '../../workoutDay/entities/workoutDay.entity';

@Entity({ name: 'workout_plans' })
export class WorkoutPlan {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty({ message: 'O nome do plano é obrigatório' })
  @IsString()
  @MaxLength(100)
  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @IsBoolean()
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => WorkoutDay, (workoutDay) => workoutDay.workoutPlan, {
    cascade: true,
  })
  workoutDays: WorkoutDay[];

  @ManyToOne(() => User, (user) => user.workoutPlans)
  user: User;
}
