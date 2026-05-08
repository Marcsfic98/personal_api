import { IsBoolean, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

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

  @IsNotEmpty({ message: 'O Dia da Semana é obrigatório' })
  @IsString()
  @Column({
    type: 'enum',
    enum: [
      'Segunda',
      'Terça',
      'Quarta',
      'Quinta',
      'Sexta',
      'Sábado',
      'Domingo',
    ],
  })
  weekDay: string;

  @IsNotEmpty({ message: 'A duração estimada é obrigatória' })
  @Column({ type: 'int', nullable: false })
  estimadedDuration: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
