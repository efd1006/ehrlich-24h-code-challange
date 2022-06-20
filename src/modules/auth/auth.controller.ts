import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDTO } from './dto';

@ApiTags("Authentication")
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('register')
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Registers a user' })
  @ApiResponse({status: 201, description: "User registration successful."})
  @ApiResponse({status: 400, description: "Email already exists."})
  async register(@Body() dto: RegisterDTO) {
    return await this.authService.register(dto);
  }

  
}
