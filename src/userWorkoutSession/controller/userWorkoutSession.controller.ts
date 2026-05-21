import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Post,
    Put,
} from '@nestjs/common';
import { UserWorkoutSession } from '../entities/userWorkoutSession.entity';
import { UserWorkoutSessionService } from './../service/userWorkoutSession.service';

@Controller('user_workout_session')
export class UserWorkoutSessionController {
  constructor(
    private readonly UserWorkoutSessionService: UserWorkoutSessionService,
  ) {}

  // NOVA ROTA: Busca o mapa de consistência focado no id do usuário
  @Get('/consistency/:userId')
  @HttpCode(HttpStatus.OK)
  async getConsistencyMap(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<Record<string, 'started' | 'completed' | 'not_started'>> {
    return await this.UserWorkoutSessionService.getConsistencyMap(userId);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.UserWorkoutSessionService.findAll();
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserWorkoutSession> {
    return await this.UserWorkoutSessionService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() UserWorkoutSession: UserWorkoutSession,
  ): Promise<UserWorkoutSession> {
    return await this.UserWorkoutSessionService.create(UserWorkoutSession);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  async update(
    @Body() UserWorkoutSession: UserWorkoutSession,
  ): Promise<UserWorkoutSession> {
    return await this.UserWorkoutSessionService.update(UserWorkoutSession);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.UserWorkoutSessionService.delete(id);
  }
}
