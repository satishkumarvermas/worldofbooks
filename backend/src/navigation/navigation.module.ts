import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Navigation } from './navigation.entity';
import { NavigationController } from './navigation.controller';
import { NavigationService } from './navigation.service';

@Module({
  imports: [TypeOrmModule.forFeature([Navigation])],
  controllers: [NavigationController],
  providers: [NavigationService],
})
export class NavigationModule {}
