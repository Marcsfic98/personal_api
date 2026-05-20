import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Meal } from '../entities/meal.entity';

@Injectable()
export class MealService {
  constructor(
    @InjectRepository(Meal)
    private readonly mealRepository: Repository<Meal>,
  ) {}

  async findAll(): Promise<Meal[]> {
    return await this.mealRepository.find({
      relations: ['diet', 'items'],
    });
  }

  async findById(id: number): Promise<Meal> {
    const meal = await this.mealRepository.findOne({
      where: { id },
      relations: ['diet', 'items'],
    });
    if (!meal) {
      throw new Error('Meal not found');
    }
    return meal;
  }

  async findByName(name: string): Promise<Meal[]> {
    return await this.mealRepository.find({
      where: {
        name: ILike(`%${name}%`),
      },
      relations: ['diet', 'items'],
    });
  }

  async create(meal: Meal): Promise<Meal> {
    return await this.mealRepository.save(meal);
  }

  async update(meal: Meal): Promise<Meal> {
    await this.findById(meal.id);
    return await this.mealRepository.save(meal);
  }

  async delete(id: number): Promise<void> {
    await this.findById(id);
    await this.mealRepository.delete(id);
  }
}
