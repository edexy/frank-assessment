/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from 'src/vehicle/entities/vehicle.entity';
import { LoanController } from './loan.controller';
import { LoanService } from './loan.service';
import { ValuationService } from 'src/valuation/valuation.service';
import { User } from 'src/user/entities/user.entity';
import { Loan } from './entities/loan.entity';
import { Valuation } from 'src/valuation/entities/valuation.entity';
import { HttpModule } from '@nestjs/axios';
import { RapidService } from 'src/integration/rapid.service';



@Module({
  imports: [
      TypeOrmModule.forFeature([
          Vehicle,
          Valuation,
          User,
          Loan
      ]),
      HttpModule,
  ],
  providers: [LoanService, ValuationService, RapidService ],
  controllers: [LoanController],
  exports: [LoanService, ValuationService, RapidService],
})



export class LoanModule {}
