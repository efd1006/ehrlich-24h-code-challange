import { Controller, Get, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { ImagesService } from './images.service';

@ApiTags('Images')
@Controller('images')
export class ImagesController {

  constructor(
    private imagesService: ImagesService
  ) {}

  @Get()
  @ApiQuery({
		name: "limit",
		description: "The maximum number of transactions to return",
		required: false,
		type: Number
	})
  async getImages(
    @Query('limit') limit: number = 5
  ) {
    // hard defaults to 5
    let q = limit <= 5 ? 5 : limit
    // hard limit of 10
    if(q >= 10) {
      q = 10
    }
    return await this.imagesService.requestImages(q)
  }
}
