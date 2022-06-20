import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDTO, RegisterDTO, RequestPasswordResetDTO, ResetPasswordDTO } from './dto';

@ApiTags("Authentication")
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('register')
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Registers a user' })
  @ApiResponse({ status: 201, description: "User registration successful." })
  async register(@Body() dto: RegisterDTO) {
    return await this.authService.register(dto);
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: "Login user" })
  @ApiResponse({ status: 201, description: "Returns the user and access token." })
  async login(
    @Body() dto: LoginDTO
  ) {
    return await this.authService.login(dto);
  }

  @Post('request-password-reset')
  async requestPasswordReset(
    @Body() dto: RequestPasswordResetDTO
  ) {
    return await this.authService.requestPasswordReset(dto)
  }

  @Post('reset-password')
  @UsePipes(new ValidationPipe())
  async resetPassword(
    @Body() dto: ResetPasswordDTO
  ) {
    return await this.authService.resetPassword(dto)
  }
}
