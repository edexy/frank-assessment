/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { Loan } from './entities/loan.entity';
import { LoanService } from './loan.service';
import { LoanApplicationDto } from './entities/loan.dto';


@Controller('loan')
export class LoanController {
  constructor(private readonly loanService: LoanService) {}

  @Post('apply')
  async applyForLoan(@Body() payload: LoanApplicationDto): Promise<Loan> {
    return this.loanService.applyForLoan(payload);
  }

  @Get(':id')
  async fetch(@Param('id') loanId: number): Promise<Loan> {
    return this.loanService.getLoanById(loanId);
  }

  @Patch('approve/:id')
  async accept(@Param('id') loanId: number): Promise<Loan> {
    return this.loanService.acceptLoanApplication(loanId);
  }

  @Patch('reject/:id')
  async reject(@Param('id') loanId: number, @Body() rejectionReason: string): Promise<Loan> {
    return this.loanService.rejectLoanApplication(loanId, rejectionReason);
  }


}


