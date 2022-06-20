import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class RequestPasswordResetDTO {
  @ApiProperty()
  @IsEmail({}, { message: "must be a vaild email address." })
  @IsNotEmpty()
  email: string
}