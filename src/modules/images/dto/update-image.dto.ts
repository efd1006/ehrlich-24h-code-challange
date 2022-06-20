import { ApiProperty } from "@nestjs/swagger";

export class UpdateImageDTO {
  @ApiProperty()
  uri: string
}