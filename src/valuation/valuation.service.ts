/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RapidService } from 'src/integration/rapid.service';
import { Vehicle } from 'src/vehicle/entities/vehicle.entity';
import { Repository } from 'typeorm';
import { Valuation } from './entities/valuation.entity'; // Import the Valuation entity


@Injectable()
export class ValuationService {
  constructor(
    @InjectRepository(Vehicle)
    private vehicleRepository: Repository<Vehicle>,
    
    @InjectRepository(Valuation)
    private valuationRepository: Repository<Valuation>,
    private rapidService: RapidService,
  ) {}

  async createValuationData(vehicleId: number): Promise<any> {
    const vehicle = await this.vehicleRepository.findOneBy({ id: vehicleId });
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    const response = await this.rapidService.getValuation(vehicle.vin);

    if(!response) {
      throw new NotFoundException('Could not evaluate vehicle');
    }

    const valuation = this.valuationRepository.create({
      vehicle,
      class: response.class,
      model: response.model,
      manufacturer: response.manufacturer,
      country: response.country,
      wmi: response.wmi,
      vis: response.vis,
      vds: response.vds,
      valuationDate: new Date(),
    });

    return this.valuationRepository.save(valuation);
  }
}
