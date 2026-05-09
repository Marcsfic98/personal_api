import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Meal } from '../../meal/entities/meal.entity';

@Entity({ name: 'diets' })
export class Diet {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty({ message: 'O nome da dieta é obrigatório' })
  @IsString()
  @MaxLength(100)
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @IsString()
  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  // Uma dieta tem várias refeições
  @OneToMany(() => Meal, (meal) => meal.diet, { cascade: true })
  meals: Meal[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
