import { IsNotEmpty } from 'class-validator';
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity()
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
}
