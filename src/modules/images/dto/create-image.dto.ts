import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsUUID } from "class-validator";

export class CreateImageDTO {
    @ApiProperty()
    @IsNotEmpty({message: "Uri is required."})
    uri: string

    @ApiProperty()
    @IsOptional()
    owner_id: string
}