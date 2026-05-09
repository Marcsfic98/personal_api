import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
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
import { Diet } from '../../diet/entities/diet.entity';
import { MealItem } from '../../mealItem/entities/mealItem.entity';

@Entity({ name: 'meals' })
export class Meal {
  @PrimaryGeneratedColumn()
  id: number;

  @IsInt()
  @Min(1)
  @Column({ type: 'int' })
  order: number; // Ex: 1 (Café), 2 (Almoço)...

  @IsNotEmpty({ message: 'O nome da refeição é obrigatório' })
  @IsString()
  @Column({ type: 'varchar', length: 100 })
  name: string;

  // Relação com a Dieta
  @ManyToOne(() => Diet, (diet) => diet.meals, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'diet_id' })
  diet: Diet;

  // Uma refeição contém vários alimentos
  @OneToMany(() => MealItem, (item) => item.meal, { cascade: true })
  items: MealItem[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
