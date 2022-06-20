import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { User } from '../auth/decorators/user.decorator';
import { UserEntity } from '../user/user.entity';
import { ImagesService } from './images.service';

@ApiTags('Images')
@Controller('images')
export class ImagesController {

  constructor(
    private imagesService: ImagesService
  ) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiQuery({
		name: "limit",
		description: "The maximum number of transactions to return",
		required: false,
		type: Number
	})
  async getImages(
    @Query('limit') limit: number = 5,
    @User() user: UserEntity
  ) {
    // hard defaults to 5
    let q = limit <= 5 ? 5 : limit
    // hard limit of 10
    if(q >= 10) {
      q = 10
    }
    return await this.imagesService.requestImages(q, user)
  }
}
