import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { LoginDTO, RegisterDTO, RequestPasswordResetDTO, ResetPasswordDTO } from './dto';
import { IAuthPayload } from './interfaces/IAuthPayload.interface';
import { hashPassword, isPasswordValid } from './utils';
import { ResetPasswordRequestEntity } from './entities/reset-password-request.entity';
import { v4 as uuidv4 } from 'uuid';
import 'dotenv/config'

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
    private mailerService: MailerService,
    @InjectRepository(ResetPasswordRequestEntity) private resetPasswordRequestRepository: Repository<ResetPasswordRequestEntity>,
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

  async requestPasswordReset(dto: RequestPasswordResetDTO) {

    const user = await this.userRepository.findOne({ where: { email: dto.email } })

    if (!user) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND)
    }

    let request = await this.resetPasswordRequestRepository.findOne({ where: { user_id: user.id } })
    let password_reset_token: string

    if (!request) {
      password_reset_token = uuidv4()
      return await this.sendRequestPasswordResetEmail(dto.email, password_reset_token).then(async () => {
        const req = this.resetPasswordRequestRepository.create({
          user_id: user.id,
          password_reset_token: password_reset_token
        })
        await this.resetPasswordRequestRepository.save(req)

        return {
          message: "Request for password reset success."
        }
      }).catch(async err => {
        throw new HttpException(err.toString(), HttpStatus.INTERNAL_SERVER_ERROR)
      })
    }


    // if theres already a pending reset password request just regenerate new password reset token, update and send to email
    password_reset_token = uuidv4()
    return await this.sendRequestPasswordResetEmail(dto.email, password_reset_token).then(async () => {
      await this.resetPasswordRequestRepository.update({ user_id: user.id }, { password_reset_token: password_reset_token })
      return {
        message: "Request for password reset success."
      }
    }).catch(async err => {
      throw new HttpException(err.toString(), HttpStatus.INTERNAL_SERVER_ERROR)
    })

  }

  async resetPassword(dto: ResetPasswordDTO) {

    // check if the password_reset_token is legitimate
    const req = await this.resetPasswordRequestRepository.findOne({ where: { password_reset_token: dto.password_reset_token } })

    if (!req) {
      throw new HttpException("Invalid password reset token", HttpStatus.BAD_REQUEST)
    }

    // compare user old password for the dto.old_password to the actual in the db
    const user = await this.userRepository.findOne({ where: { id: req.user_id } })

    const isValidPassword = await isPasswordValid(dto.old_password, user.password)

    if (!isValidPassword) {
      throw new HttpException("Incorrect old password", HttpStatus.BAD_REQUEST)
    }

    // if all the checks for the above passed then we update the old password to the new password
    const hashedPassword = await hashPassword(dto.new_password)

    await this.userRepository.update({ id: user.id }, { password: hashedPassword })

    // delete the request password reset since already  successfully updated the password
    await this.resetPasswordRequestRepository.delete({ id: req.id })
    return {
      message: "Password has been successfully reset."
    }

  }

  private async sendRequestPasswordResetEmail(to: string, password_reset_token: string) {
    return this.mailerService.sendMail({
      to: to,
      from: process.env.MAILER_SOURCE,
      subject: "Reset Password Request",
      template: 'request-password-reset',
      context: {
        password_reset_token: password_reset_token
      }
    })
  }
}
