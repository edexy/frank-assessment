/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from './user.service';
import { User } from './entities/user.entity';

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  const mockUserRepository = {
    create: jest.fn().mockImplementation((userData) => userData),
    save: jest.fn().mockImplementation((user) => Promise.resolve({ id: Date.now(), ...user })),
    findOneBy: jest.fn().mockImplementation(({ id }) =>
      Promise.resolve({ id, name: 'Test User', email: 'test@example.com' })
    ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create and return a user', async () => {
      const userData = { name: 'John Doe', email: 'john.doe@example.com' };
      const result = await service.createUser(userData);

      expect(mockUserRepository.create).toHaveBeenCalledWith(userData);
      expect(mockUserRepository.save).toHaveBeenCalledWith(userData);
      expect(result).toEqual(expect.objectContaining(userData));
      expect(result.id).toBeDefined();
    });
  });

  describe('getUserById', () => {
    it('should return a user by ID', async () => {
      const id = 1;
      const result = await service.getUserById(id);

      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id });
      expect(result).toEqual(expect.objectContaining({ id, name: 'Test User', email: 'test@example.com' }));
    });

    it('should return null if user not found', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(null);

      const id = 999;
      const result = await service.getUserById(id);

      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id });
      expect(result).toBeNull();
    });
  });
});
