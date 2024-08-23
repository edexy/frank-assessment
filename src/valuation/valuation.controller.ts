/* eslint-disable prettier/prettier */
import { Controller, Get, Param } from '@nestjs/common';
import { Vehicle } from 'src/vehicle/entities/vehicle.entity';
import { ValuationService } from './valuation.service';


@Controller('valuation')
export class ValuationController {
  constructor(private readonly valuationService: ValuationService) {}

  @Get(':id')
  async create(@Param('id') vehicleData: number): Promise<Vehicle> {
    return this.valuationService.createValuationData(vehicleData);
  }

}
