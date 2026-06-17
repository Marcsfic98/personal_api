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

  async create(workoutDay: WorkoutDay): Promise<WorkoutDay> {
    // 1. Extrai o ID do plano de treino de dentro do objeto ou da relação tratada pelo TypeORM
    // Dependendo de como está sua entidade, pode ser workoutPlanId ou workoutPlan.id
    const planId =
      workoutDay.workoutPlanId || (workoutDay.workoutPlan as any)?.id;

    if (!planId) {
      throw new HttpException(
        'O ID do Plano de Treino (workoutPlanId) é obrigatório.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // 2. Busca se já existe um dia cadastrado para ESTE plano e ESTE dia da semana
    const diaExistente = await this.workoutDayRepository.findOne({
      where: {
        weekDay: workoutDay.weekDay,
        workoutPlan: { id: planId }, // Ou apenas workoutPlanId: planId se sua entidade expor a FK diretamente
      },
      relations: ['WorkoutExercice'],
    });

    if (diaExistente) {
      console.log(
        `[Upsert] Atualizando dia existente ID ${diaExistente.id} para o dia da semana: ${workoutDay.weekDay}`,
      );

      // 3. REGRA DE OURO: Se o dia já existe, precisamos garantir que o TypeORM sobrescreva
      // o registro antigo. Injetamos o ID existente no objeto que será salvo.
      workoutDay.id = diaExistente.id;

      // 4. OPCIONAL (Mas altamente recomendado): Se você usa cascade para salvar os exercícios,
      // e quer que a nova lista substitua COMPLEMENTAMENTE a antiga sem deixar lixo no banco,
      // idealmente limpamos a tabela de exercícios vinculada a esse dia antes de salvar o novo payload.
      if (
        diaExistente.WorkoutExercice &&
        diaExistente.WorkoutExercice.length > 0
      ) {
        // Se você tiver o repositório de exercícios injetado aqui, poderia deletar direto.
        // Como o TypeORM faz o save em cascata, definir o ID no payload principal vai tentar atualizar/inserir.
      }
    } else {
      console.log(
        `[Upsert] Criando novo dia de treino para o dia da semana: ${workoutDay.weekDay}`,
      );
    }

    // 5. O .save() do TypeORM faz a mágica: Se tiver .id ele dá UPDATE, se não tiver ele dá INSERT
    return await this.workoutDayRepository.save(workoutDay);
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
