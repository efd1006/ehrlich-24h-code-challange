import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { RegisterDTO } from './dto';
import { hashPassword } from './utils';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>
  ) { }

  async register(dto: RegisterDTO) {
    let user = await this.userRepository.findOne({ where: { email: dto.email } })

    // check for duplicate email
    if (user) {
      throw new HttpException("Email already exists.", HttpStatus.BAD_REQUEST)
    }

    // replace the dto password property from plain to hashed 
    let hashedPassword = await hashPassword(dto.password)
    dto = {
      ...dto,
      password: hashedPassword
    }

    user = await this.userRepository.create(dto);
    await this.userRepository.save(user);

    return {
      user: user,
      message: "User registration success."
    }
  }

}
