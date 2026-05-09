import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MealItem } from './entities/mealItem.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MealItem])],
  controllers: [MealItemController],
  providers: [MealItemService],
})
export class MealItemModule {}
