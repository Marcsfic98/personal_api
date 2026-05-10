import { IsNotEmpty } from 'class-validator';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';

import { WorkoutDay } from '../../workoutDay/entities/workoutDay.entity';

@Entity('workout_exercices')
export class WorkoutExercice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  order: number;

  @IsNotEmpty({ message: 'O nome do exercício é obrigatório' })
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @IsNotEmpty({ message: 'O número de séries é obrigatório' })
  @Column({ type: 'int' })
  sets: number;

  @IsNotEmpty({ message: 'O número de repetições é obrigatório' })
  @Column({ type: 'int' })
  reps: number;

  @Column({ type: 'int' })
  restTime: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ nullable: true })
  workoutDayId: number; // Esta coluna receberá o "2" do seu JSON

  @ManyToOne(() => WorkoutDay, (workoutDay) => workoutDay.WorkoutExercice, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'workoutDayId' }) // Vincula o objeto à coluna de ID
  workoutDay: WorkoutDay;
}
