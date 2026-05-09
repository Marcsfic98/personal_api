import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MealItemController } from './controller/mealItem.controller';
import { MealItem } from './entities/mealItem.entity';
import { MealItemService } from './service/mealItem.service';

@Module({
  imports: [TypeOrmModule.forFeature([MealItem])],
  controllers: [MealItemController],
  providers: [MealItemService],
})
export class MealItemModule {}
