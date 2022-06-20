import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { LoginDTO, RegisterDTO } from './dto';
import { IAuthPayload } from './interfaces/IAuthPayload.interface';
import { hashPassword, isPasswordValid } from './utils';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    private jwtService: JwtService
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

  async login(dto: LoginDTO) {
    const user = await this.userRepository.findOne({ where: { email: dto.email } })

    // check if password is valid
    const isValid = await isPasswordValid(dto.password, user.password)

    if (!isValid) {
      throw new HttpException("Invalid credentials.", HttpStatus.BAD_REQUEST)
    }

    const payload: IAuthPayload = { id: user.id }
    const access_token = this.jwtService.sign(payload)
    return {
      user: user.toJSON(),
      access_token: access_token
    }
  }

}
