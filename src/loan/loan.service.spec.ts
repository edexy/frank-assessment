/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { BadRequestException, InternalServerErrorException, Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { ValuationService } from 'src/valuation/valuation.service';
import { Vehicle } from 'src/vehicle/entities/vehicle.entity';
import { LOAN_STATUS, Loan } from './entities/loan.entity';
import { LoanService } from './loan.service';

describe('LoanService', () => {
  let service: LoanService;
  const mockUserRepository = {
    findOne: jest.fn(),
  };

  const mockVehicleRepository = {
    findOne: jest.fn(),
  };

  const mockLoanRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn(),
  };

  const mockValuationService = {
    createValuationData: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoanService,
        Logger,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Vehicle),
          useValue: mockVehicleRepository,
        },
        {
          provide: getRepositoryToken(Loan),
          useValue: mockLoanRepository,
        },
        {
          provide: ValuationService,
          useValue: mockValuationService,
        },
      ],
    }).compile();

    service = module.get<LoanService>(LoanService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('applyForLoan', () => {
    const loanApplicationDto = { userId: 1, vehicleId: 1 };

    it('should throw BadRequestException if user or vehicle is not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      mockVehicleRepository.findOne.mockResolvedValue(null);

      await expect(service.applyForLoan(loanApplicationDto)).rejects.toThrow(BadRequestException);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: loanApplicationDto.userId } });
      expect(mockVehicleRepository.findOne).toHaveBeenCalledWith({ where: { id: loanApplicationDto.vehicleId } });
    });

    it('should throw BadRequestException if credit score is too low', async () => {
      mockUserRepository.findOne.mockResolvedValue({ id: 1, creditScore: 500 });
      mockVehicleRepository.findOne.mockResolvedValue({ id: 1, price: 10000 });

      await expect(service.applyForLoan(loanApplicationDto)).rejects.toThrow(BadRequestException);
    });
  });
})