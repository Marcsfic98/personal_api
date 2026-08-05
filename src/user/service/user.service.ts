import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bcrypt } from '../../auth/bcrypt/bcrypt';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private bcrypt: Bcrypt,
  ) {}

  private calculateImc(
    weight: number | null,
    height: number | null,
  ): number | null {
    if (!weight || !height || height <= 0) {
      return null;
    }
    const imc = weight / (height * height);
    return parseFloat(imc.toFixed(2));
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email: email },
      relations: ['workoutPlans', 'diet', 'userWorkoutSessions'],
    });
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      relations: [
        'workoutPlans',
        'diet',
        'userWorkoutSessions',
        'workoutPlans.workoutDays',
        'workoutPlans.workoutDays.WorkoutExercice',
      ],
    });
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: [
        'workoutPlans',
        'diet',
        'diet.meals',
        'diet.meals.items',
        'userWorkoutSessions',
        'workoutPlans.workoutDays',
        'workoutPlans.workoutDays.WorkoutExercice',
      ],
    });

    if (!user)
      throw new HttpException('usuario não encontrado!', HttpStatus.NOT_FOUND);

    user.imc = this.calculateImc(user.weight, user.height);

    return user;
  }

  async create(user: User): Promise<User> {
    const finduser = await this.findByEmail(user.email);

    if (finduser)
      throw new HttpException('O usuario já existe!', HttpStatus.BAD_REQUEST);

    user.imc = this.calculateImc(user.weight, user.height);
    user.password = await this.bcrypt.encryptPassword(user.password);
    return await this.userRepository.save(user);
  }

  // 💡 ATUALIZADO: Faz o merge parcial apenas dos campos antropométricos enviados
  async update(user: User): Promise<User> {
    // 1. Busca o utilizador atual completo do banco de dados
    const existingUser = await this.findById(user.id);

    // 2. Substitui apenas as propriedades que vieram na requisição
    existingUser.weight =
      user.weight !== undefined ? user.weight : existingUser.weight;
    existingUser.height =
      user.height !== undefined ? user.height : existingUser.height;
    existingUser.age = user.age !== undefined ? user.age : existingUser.age;
    existingUser.goal = user.goal !== undefined ? user.goal : existingUser.goal;

    // 3. Recalcula o IMC dinamicamente com base nos dados consolidados
    existingUser.imc = this.calculateImc(
      existingUser.weight,
      existingUser.height,
    );

    // 4. Salva a entidade existente (nome, e-mail e password permanecem intocados)
    return await this.userRepository.save(existingUser);
  }

  async createGoogleUser(user: any): Promise<User> {
    const finduser = await this.findByEmail(user.email);

    if (finduser)
      throw new HttpException('O usuario já existe!', HttpStatus.BAD_REQUEST);

    const newUser = {
      ...user,
      imc: this.calculateImc(user.weight, user.height),
      password: null,
    };

    return await this.userRepository.save(newUser);
  }

  async updateWithoutPassword(user: User): Promise<User> {
    await this.findById(user.id);

    const finduser = await this.findByEmail(user.email);

    if (finduser && finduser.id !== user.id)
      throw new HttpException(
        'Usuário (e-mail) já Cadastrado!',
        HttpStatus.BAD_REQUEST,
      );

    return await this.userRepository.save(user);
  }
}
