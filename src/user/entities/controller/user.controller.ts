import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Post,
    Put,
} from '@nestjs/common';
import {
    ApiBody,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiTags,
} from '@nestjs/swagger';
import { UserService } from './../../service/user.service';

import { User } from '../user.entity';

@Controller('/users')
@ApiTags('Users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Listar todos os usuários' })
  @ApiOkResponse({ description: 'Lista de usuários', type: User, isArray: true })
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Buscar usuário por ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do usuário' })
  @ApiOkResponse({ description: 'Usuário encontrado', type: User })
  findById(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.userService.findById(id);
  }

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar usuário' })
  @ApiBody({ type: User })
  @ApiCreatedResponse({ description: 'Usuário criado com sucesso', type: User })
  async create(@Body() user: User): Promise<User> {
    return this.userService.create(user);
  }

  // 💡 AJUSTADO: Agora aceita propriedades parciais do Usuário
  @Put('/update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Atualizar usuário' })
  @ApiBody({ type: User })
  @ApiOkResponse({ description: 'Usuário atualizado com sucesso', type: User })
  async update(@Body() user: Partial<User>): Promise<User> {
    return this.userService.update(user as User);
  }
}
