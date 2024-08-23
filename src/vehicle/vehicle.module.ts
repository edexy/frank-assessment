/* eslint-disable prettier/prettier */
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { VehicleController } from './vehicle.controller';
import { VehicleService } from './vehicle.service';
  
@Module({
    imports: [
        TypeOrmModule.forFeature([
            Vehicle,
        ]),
        HttpModule, 
    ],
    providers: [VehicleService],
    controllers: [VehicleController],
    exports: [VehicleService],
  })



export class VehicleModule {}