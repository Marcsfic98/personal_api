import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, ILike, Repository } from 'typeorm';
import { WorkoutExercice } from '../entities/workoutExercice.entity';

@Injectable()
export class WorkoutExerciceService {
  constructor(
    @InjectRepository(WorkoutExercice)
    private workoutExerciceRepository: Repository<WorkoutExercice>,
  ) {}

  async findAll(): Promise<WorkoutExercice[]> {
    return await this.workoutExerciceRepository.find({
      relations: ['workoutDay'],
    });
  }

  async findById(id: number): Promise<WorkoutExercice> {
    const WorkoutExercice = await this.workoutExerciceRepository.findOne({
      where: { id },
      relations: ['workoutDay'],
    });

    if (!WorkoutExercice) {
      throw new HttpException(
        'Exercicio  não encontrado',
        HttpStatus.NOT_FOUND,
      );
    }

    return WorkoutExercice;
  }

  async findByName(name: string): Promise<WorkoutExercice[]> {
    return await this.workoutExerciceRepository.find({
      where: {
        name: ILike(`%${name}%`),
      },
      relations: ['workoutDay'],
    });
  }

  async create(
    workoutExeWorkoutExercice: WorkoutExercice,
  ): Promise<WorkoutExercice> {
    return await this.workoutExerciceRepository.save(workoutExeWorkoutExercice);
  }

  async update(
    workoutExeWorkoutExercice: WorkoutExercice,
  ): Promise<WorkoutExercice> {
    await this.findById(workoutExeWorkoutExercice.id);
    return await this.workoutExerciceRepository.save(workoutExeWorkoutExercice);
  }

  async delete(id: number): Promise<DeleteResult> {
    await this.findById(id);
    return await this.workoutExerciceRepository.delete(id);
  }
}
