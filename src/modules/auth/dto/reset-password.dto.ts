import { ApiProperty } from "@nestjs/swagger";
import { Allow, IsNotEmpty, Matches, MinLength } from "class-validator";

export class ResetPasswordDTO {

  @ApiProperty()
  @IsNotEmpty()
  password_reset_token: string

  @ApiProperty()
  @IsNotEmpty()
  old_password: string

  @ApiProperty()
  @Allow()
  @MinLength(8, { message: 'new password must be longer than or equal to 8 characters' })
  @Matches('(.*[a-z].*)', "", { message: "new password must contain atleast one lowercase" })
  @Matches('(.*[A-Z].*)', "", { message: "new password must contain atleast one uppercase" })
  @Matches('(.*[0-9].*)', "", { message: "new password must contain atleast one digit" })
  @Matches('(?=[^#?!@$%^&*\n-]*[#?!@$%^&*-])', "", { message: "new password must contain atleast one symbol" })
  @IsNotEmpty()
  new_password: string

}