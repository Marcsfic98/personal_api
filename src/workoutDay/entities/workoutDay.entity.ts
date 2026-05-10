import {
    IsBoolean,
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsString,
    MaxLength,
    Min,
} from 'class-validator';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { UserWorkoutSession } from '../../userWorkoutSession/entities/userWorkoutSession.entity';
import { WorkoutExercice } from '../../workoutExercice/entities/workoutExercice.entity';
import { WorkoutPlan } from '../../workoutPlan/entities/workoutPlan.entity';

export enum WeekDay {
  SEGUNDA = 'Segunda',
  TERCA = 'Terça',
  QUARTA = 'Quarta',
  QUINTA = 'Quinta',
  SEXTA = 'Sexta',
  SABADO = 'Sábado',
  DOMINGO = 'Domingo',
}

@Entity({ name: 'workout_day' })
export class WorkoutDay {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty({ message: 'O nome do plano é obrigatório' })
  @IsString()
  @MaxLength(100)
  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @IsBoolean()
  @Column({ type: 'boolean', default: true })
  isRest: boolean;

  @IsEnum(WeekDay, { message: 'Dia da semana inválido' })
  @Column({
    type: 'enum',
    enum: WeekDay,
  })
  weekDay: WeekDay;

  @IsInt()
  @Min(0)
  @IsNotEmpty({ message: 'A duração estimada é obrigatória' })
  @Column({ name: 'estimated_duration', type: 'int', nullable: false })
  estimatedDuration: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ nullable: true })
  workoutPlanId: number; // Esta coluna receberá o "2" do seu JSON

  @ManyToOne(() => WorkoutPlan, (workoutPlan) => workoutPlan.workoutDays, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'workoutPlanId' }) // Vincula o objeto à coluna de ID
  workoutPlan: WorkoutPlan;

  @OneToMany(
    () => WorkoutExercice,
    (WorkoutExercice) => WorkoutExercice.workoutDay,
    { cascade: true },
  )
  WorkoutExercice: WorkoutExercice[];

  @OneToMany(
    () => UserWorkoutSession,
    (userWorkoutSession) => userWorkoutSession.workoutDay,
    { cascade: true },
  )
  userWorkoutSessions: UserWorkoutSession[];
}
