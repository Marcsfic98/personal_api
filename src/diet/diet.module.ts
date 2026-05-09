import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Diet } from './entities/diet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Diet])],
  controllers: [DietController],
  providers: [DietService],
})
export class DietModule {}
