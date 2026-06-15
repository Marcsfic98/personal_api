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

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: {
        email: email,
      },
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
      where: {
        id,
      },
      relations: ['workoutPlans', 'diet', 'userWorkoutSessions'],
    });

    if (!user)
      throw new HttpException('usuario não encontrado!', HttpStatus.NOT_FOUND);

    return user;
  }

  async create(user: User): Promise<User> {
    const finduser = await this.findByEmail(user.email);

    if (finduser)
      throw new HttpException('O usuario já existe!', HttpStatus.BAD_REQUEST);

    user.password = await this.bcrypt.encryptPassword(user.password);
    return await this.userRepository.save(user);
  }

  async update(user: User): Promise<User> {
    await this.findById(user.id);

    const finduser = await this.findByEmail(user.email);

    if (finduser && finduser.id !== user.id)
      throw new HttpException(
        'Usuário (e-mail) já Cadastrado!',
        HttpStatus.BAD_REQUEST,
      );

    user.password = await this.bcrypt.encryptPassword(user.password);
    return await this.userRepository.save(user);
  }

  async createGoogleUser(user: any): Promise<User> {
    const finduser = await this.findByEmail(user.email);

    if (finduser)
      throw new HttpException('O usuario já existe!', HttpStatus.BAD_REQUEST);

    const newUser = {
      ...user,
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
