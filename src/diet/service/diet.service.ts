import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Diet } from '../entities/diet.entity';

@Injectable()
export class DietService {
  constructor(
    @InjectRepository(Diet)
    private dietRepository: Repository<Diet>,
  ) {}

  async findAll(): Promise<Diet[]> {
    return await this.dietRepository.find({
      relations: ['user'], // Inclui a relação com o usuário
    });
  }

  async findById(id: number): Promise<Diet> {
    const diet = await this.dietRepository.findOne({
      where: { id },
      relations: ['user'], // Inclui a relação com o usuário
    });
    if (!diet) {
      throw new Error('Diet not found');
    }
    return diet;
  }

  async findByName(name: string): Promise<Diet[]> {
    return await this.dietRepository.find({
      where: {
        name: ILike(`%${name}%`),
      },
      relations: ['user'], // Inclui a relação com o usuário
    });
  }

  async create(diet: Diet): Promise<Diet> {
    return await this.dietRepository.save(diet);
  }

  async update(diet: Diet): Promise<Diet> {
    await this.findById(diet.id);
    return await this.dietRepository.save(diet);
  }

  async delete(id: number): Promise<void> {
    await this.findById(id);
    await this.dietRepository.delete(id);
  }
}
