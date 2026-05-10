import { UserWorkoutSession } from './../../userWorkoutSession/entities/userWorkoutSession.entity';
import { Diet } from './../../diet/entities/diet.entity';
import { WorkoutPlan } from './../../workoutPlan/entities/workoutPlan.entity';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OneToMany } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @Column({ length: 255, nullable: false })
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @Column({ length: 255, nullable: false })
  email: string;

  @IsEmail()
  @IsNotEmpty()
  @Column({ length: 255, nullable: false })
  emailVerified: string;

  @MinLength(8)
  @Column({ length: 255, nullable: true })
  password: string;

  @Column({ length: 5000 })
  image: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(
    () => UserWorkoutSession,
    (userWorkoutSession) => userWorkoutSession.user,
    { cascade: true },
  )
  userWorkoutSessions: UserWorkoutSession[];

  @OneToMany(() => WorkoutPlan, (workoutPlan) => workoutPlan.user, {
    cascade: true,
  })
  workoutPlans: WorkoutPlan[];

  @OneToMany(() => Diet, (diet) => diet.user, { cascade: true })
  diet: Diet[];
}
