import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { userInterface } from './user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  create(userInterface: userInterface) {
    // get user data
    // get random full number
    // get current date
    const date = new Date();
    userInterface.created_at = date;
    const user = Object.assign(new User(), userInterface);
    return this.userRepository.save(user);
  }

  findAll(): Promise<User[]> {
    const users = this.userRepository.find();
    return users;
  }

  findOne(id: number) {
    const user = this.userRepository.findOneBy({ id });
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
