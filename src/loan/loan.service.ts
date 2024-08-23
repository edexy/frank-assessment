/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { ValuationService } from 'src/valuation/valuation.service';
import { Vehicle } from 'src/vehicle/entities/vehicle.entity';
import { Repository } from 'typeorm';
import { LOAN_STATUS, Loan } from './entities/loan.entity';
import { LoanApplicationDto } from './entities/loan.dto';

@Injectable()
export class LoanService {
  private readonly logger = new Logger(LoanService.name);

  constructor(
    @InjectRepository(Loan)
    private readonly loanRepository: Repository<Loan>,
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly valuationService: ValuationService,
  ) {}

  async applyForLoan(payload: LoanApplicationDto): Promise<Loan> {
    this.logger.log(`Applying for loan: User ID - ${payload.userId}, Vehicle ID - ${payload.vehicleId}`);
    
    const { userId, vehicleId } = payload;
    
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const vehicle = await this.vehicleRepository.findOne({ where: { id: vehicleId } });

    if (!user || !vehicle) {
      this.logger.error(`User or Vehicle not found: User ID - ${userId}, Vehicle ID - ${vehicleId}`);
      throw new BadRequestException('User or Vehicle not found');
    }

    try {
      const valuation = await this.valuationService.createValuationData(vehicleId);
      this.logger.debug(`Valuation data created: ${JSON.stringify(valuation)}`);
      
      // Basic loan eligibility checks
      if (user.creditScore < 600) {
        this.logger.warn(`Loan application denied: Credit score too low for User ID - ${userId}`);
        throw new BadRequestException('Loan application denied: Credit score too low');
      }

      const expectedMonthlyRepayment = this.calculateMonthlyRepayment(vehicle.price);
      if (user.monthlyIncome < expectedMonthlyRepayment * 3) {
        this.logger.warn(`Loan application denied: Insufficient income for User ID - ${userId}`);
        throw new BadRequestException('Insufficient income for loan approval');
      }

      const loan = this.loanRepository.create({
        applicantName: user.name,
        vehicle,
        vehicleLoanAmount: vehicle.price,
        applicationDate: new Date(),
        loanTermMonths: 12,
        approvalDate: new Date(),
        rejectionReason: 'none',
        status: LOAN_STATUS.PENDING,
      });

      return await this.loanRepository.save(loan);
    } catch (error) {
      this.logger.error(`Failed to apply for loan: User ID - ${userId}, Vehicle ID - ${vehicleId}`, error.stack);
      throw new InternalServerErrorException('An error occurred while processing the loan application');
    }
  }

  async getLoanById(id: number): Promise<Loan> {
    this.logger.log(`Fetching loan by ID: ${id}`);
    
    try {
      const loan = await this.loanRepository.findOneBy({ id });
      if (!loan) {
        this.logger.warn(`Loan not found: ID - ${id}`);
        throw new BadRequestException('Loan not found');
      }
      return loan;
    } catch (error) {
      this.logger.error(`Failed to fetch loan by ID: ${id}`, error.stack);
      throw new InternalServerErrorException('An error occurred while fetching the loan');
    }
  }

  async acceptLoanApplication(loanId: number): Promise<Loan> {
    this.logger.log(`Accepting loan application: Loan ID - ${loanId}`);
    
    try {
      const loan = await this.loanRepository.findOne({ where: { id: loanId } });
      if (!loan) {
        this.logger.warn(`Loan not found: ID - ${loanId}`);
        throw new BadRequestException('Loan not found');
      }

      loan.status = LOAN_STATUS.APPROVED;
      return await this.loanRepository.save(loan);
    } catch (error) {
      this.logger.error(`Failed to accept loan application: Loan ID - ${loanId}`, error.stack);
      throw new InternalServerErrorException('An error occurred while accepting the loan application');
    }
  }

  async rejectLoanApplication(loanId: number, rejectionReason: string): Promise<Loan> {
    this.logger.log(`Rejecting loan application: Loan ID - ${loanId}, Reason - ${rejectionReason}`);
    
    try {
      const loan = await this.loanRepository.findOne({ where: { id: loanId } });
      if (!loan) {
        this.logger.warn(`Loan not found: ID - ${loanId}`);
        throw new BadRequestException('Loan not found');
      }

      loan.status = LOAN_STATUS.REJECTED;
      loan.rejectionReason = rejectionReason;
      return await this.loanRepository.save(loan);
    } catch (error) {
      this.logger.error(`Failed to reject loan application: Loan ID - ${loanId}`, error.stack);
      throw new InternalServerErrorException('An error occurred while rejecting the loan application');
    }
  }

  calculateMonthlyRepayment(loanAmount: number): number {
    const interestRate = 0.05; // 5% interest rate 
    const loanTermInMonths = 12; // 1 year loan term 

    const monthlyRepayment = (loanAmount * (1 + interestRate)) / loanTermInMonths;
    this.logger.debug(`Calculated monthly repayment: Loan Amount - ${loanAmount}, Monthly Repayment - ${monthlyRepayment}`);
    
    return monthlyRepayment;
  }
}
