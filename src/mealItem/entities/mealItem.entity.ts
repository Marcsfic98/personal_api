import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Meal } from '../../meal/entities/meal.entity';


@Entity({ name: 'meal_items' })
export class MealItem {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty({ message: 'O nome do alimento é obrigatório' })
  @IsString()
  @Column({ type: 'varchar', length: 255 })
  name: string; // Ex: Frango Grelhado, Arroz Integral

  @IsNumber()
  @Min(0)
  @IsNotEmpty({ message: 'A quantidade em gramas é obrigatória' })
  @Column({ type: 'float', name: 'weight_in_grams' })
  weightInGrams: number; // Ex: 150.5

  // Muitos itens pertencem a uma refeição
  @ManyToOne(() => Meal, (meal) => meal.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'meal_id' })
  meal: Meal;
}
