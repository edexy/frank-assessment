/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Create a new user
  async createUser(userData: Partial<User>): Promise<User> {
    console.log("userData", userData)
    const user = this.userRepository.create({  ...userData});

    return this.userRepository.save(user);
  }

  // Get a user by ID
  async getUserById(id: number): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }
}
