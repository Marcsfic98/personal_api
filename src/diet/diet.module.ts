import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DietController } from './controller/diet.controller';
import { Diet } from './entities/diet.entity';
import { DietService } from './service/diet.service';

@Module({
  imports: [TypeOrmModule.forFeature([Diet])],
  controllers: [DietController],
  providers: [DietService],
})
export class DietModule {}
