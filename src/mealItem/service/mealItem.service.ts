import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, ILike, Repository } from 'typeorm';
import { MealItem } from '../entities/mealItem.entity';

@Injectable()
export class MealItemService {
  constructor(
    @InjectRepository(MealItem)
    private workoutRepository: Repository<MealItem>,
  ) {}

  async findAll(): Promise<MealItem[]> {
    return await this.workoutRepository.find({
      relations: ['meal'],
    });
  }

  async findById(id: number): Promise<MealItem> {
    const MealItem = await this.workoutRepository.findOne({
      where: { id },
      relations: ['meal'],
    });

    if (!MealItem) {
      throw new HttpException('Alimento não encontrado', HttpStatus.NOT_FOUND);
    }

    return MealItem;
  }

  async findByName(name: string): Promise<MealItem[]> {
    return await this.workoutRepository.find({
      where: {
        name: ILike(`%${name}%`),
      },
      relations: ['meal'],
    });
  }

  async create(MealItem: MealItem): Promise<MealItem> {
    return await this.workoutRepository.save(MealItem);
  }

  async update(MealItem: MealItem): Promise<MealItem> {
    await this.findById(MealItem.id);
    return await this.workoutRepository.save(MealItem);
  }

  async delete(id: number): Promise<DeleteResult> {
    await this.findById(id);
    return await this.workoutRepository.delete(id);
  }
}
