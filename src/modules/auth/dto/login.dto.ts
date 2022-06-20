import { ApiProperty } from "@nestjs/swagger";
import { Allow, IsNotEmpty } from "class-validator";

export class LoginDTO {
    @ApiProperty()
    email: string

    @ApiProperty()
    password: string
}