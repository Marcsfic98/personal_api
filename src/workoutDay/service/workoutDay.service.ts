import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, ILike, Repository } from 'typeorm';
import { WorkoutDay } from '../entities/workoutDay.entity';

@Injectable()
export class WorkoutDayService {
  constructor(
    @InjectRepository(WorkoutDay)
    private workoutDayRepository: Repository<WorkoutDay>,
  ) {}

  async findAll(): Promise<WorkoutDay[]> {
    return await this.workoutDayRepository.find({
      relations: ['workoutPlan', 'WorkoutExercice'],
    });
  }

  async findById(id: number): Promise<WorkoutDay> {
    const WorkoutDay = await this.workoutDayRepository.findOne({
      where: { id },
      relations: ['workoutPlan', 'WorkoutExercice'],
    });

    if (!WorkoutDay) {
      throw new HttpException(
        'Dia de treino não encontrado',
        HttpStatus.NOT_FOUND,
      );
    }

    return WorkoutDay;
  }

  async findByName(name: string): Promise<WorkoutDay[]> {
    return await this.workoutDayRepository.find({
      where: {
        name: ILike(`%${name}%`),
      },
      relations: ['workoutPlan', 'WorkoutExercice'],
    });
  }

  async create(WorkoutDay: WorkoutDay): Promise<WorkoutDay> {
    return await this.workoutDayRepository.save(WorkoutDay);
  }

  async update(WorkoutDay: WorkoutDay): Promise<WorkoutDay> {
    await this.findById(WorkoutDay.id);
    return await this.workoutDayRepository.save(WorkoutDay);
  }

  async delete(id: number): Promise<DeleteResult> {
    await this.findById(id);
    return await this.workoutDayRepository.delete(id);
  }
}
