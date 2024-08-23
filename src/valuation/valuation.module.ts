/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ValuationController } from './valuation.controller';
import { ValuationService } from './valuation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { Vehicle } from 'src/vehicle/entities/vehicle.entity';
import { Valuation } from './entities/valuation.entity';
import { RapidService } from 'src/integration/rapid.service';


@Module({
  imports: [
      TypeOrmModule.forFeature([
          Vehicle,
          Valuation
      ]),
      HttpModule, 
  ],
  providers: [ValuationService, RapidService],
  controllers: [ValuationController],
  exports: [ValuationService, RapidService],
})



export class ValuationModule {}
