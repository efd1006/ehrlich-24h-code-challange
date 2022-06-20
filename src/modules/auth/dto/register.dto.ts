import { ApiProperty } from "@nestjs/swagger";
import { Allow, IsNotEmpty, Matches, MinLength } from "class-validator";
import { UserDTO } from "../../user/dto";

export class RegisterDTO extends UserDTO {
  @ApiProperty()
  @Allow()
  @MinLength(8, { message: 'password must be longer than or equal to 8 characters' })
  @Matches('(.*[a-z].*)', "", { message: "password must contain atleast one lowercase" })
  @Matches('(.*[A-Z].*)', "", { message: "password must contain atleast one uppercase" })
  @Matches('(.*[0-9].*)', "", { message: "password must contain atleast one digit" })
  @Matches('(?=[^#?!@$%^&*\n-]*[#?!@$%^&*-])', "", { message: "password must contain atleast one symbol" })
  @IsNotEmpty()
  password: string
}