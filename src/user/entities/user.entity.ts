import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';
import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Diet } from './../../diet/entities/diet.entity';
import { UserWorkoutSession } from './../../userWorkoutSession/entities/userWorkoutSession.entity';
import { WorkoutPlan } from './../../workoutPlan/entities/workoutPlan.entity';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

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

  @Column({ length: 5000, nullable: true })
  image: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  weight: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  height: number;

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true })
  imc: number | null;

  @Column({ nullable: true })
  age: number;

  @Column({ length: 255, nullable: true })
  goal: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  @IsEnum(UserRole)
  role: UserRole;

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
