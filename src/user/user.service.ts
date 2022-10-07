import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable } from 'rxjs';
import { DataSource, Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { userInterface } from './user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private dataSource: DataSource,
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
  // create many users once
  async createMany(users: userInterface[]) {
    // use queryRunner to create many users
    // https://typeorm.io/#/query-runner/using-query-runner
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      users.forEach((user) => {
        const date = new Date();
        user.created_at = date;
        const userEntity = Object.assign(new User(), user);
        queryRunner.manager.save(userEntity);
      });
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
