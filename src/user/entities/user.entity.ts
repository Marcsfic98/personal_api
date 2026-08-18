import { ApiHideProperty, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiProperty({ description: 'Identificador único do usuário', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Nome do usuário', example: 'João Silva' })
  @IsNotEmpty()
  @Column({ length: 255, nullable: false })
  name: string;

  @ApiProperty({ description: 'E-mail do usuário', example: 'joao@email.com' })
  @IsEmail()
  @IsNotEmpty()
  @Column({ length: 255, nullable: false })
  email: string;

  @ApiPropertyOptional({ description: 'Status de verificação do e-mail' })
  @IsEmail()
  @IsNotEmpty()
  @Column({ length: 255, nullable: false })
  emailVerified: string;

  @ApiHideProperty()
  @MinLength(8)
  @Column({ length: 255, nullable: true })
  password: string;

  @ApiPropertyOptional({ description: 'URL da imagem do perfil' })
  @Column({ length: 5000, nullable: true })
  image: string;

  @ApiPropertyOptional({ description: 'Peso do usuário' })
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  weight: number;

  @ApiPropertyOptional({ description: 'Altura do usuário' })
  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  height: number;

  @ApiPropertyOptional({ description: 'Índice de massa corporal calculado' })
  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true })
  imc: number | null;

  @ApiPropertyOptional({ description: 'Idade do usuário' })
  @Column({ nullable: true })
  age: number;

  @ApiPropertyOptional({ description: 'Objetivo do usuário' })
  @Column({ length: 255, nullable: true })
  goal: string;

  @ApiProperty({ enum: UserRole, default: UserRole.USER, description: 'Papel do usuário' })
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiPropertyOptional({ description: 'Data de criação do usuário' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiPropertyOptional({ description: 'Data da última atualização do usuário' })
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
