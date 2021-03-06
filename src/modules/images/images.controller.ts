import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/role.decorator';
import { User } from '../auth/decorators/user.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../user/enums';
import { UserEntity } from '../user/user.entity';
import { CreateImageDTO, UpdateImageDTO } from './dto';
import { ImagesService } from './images.service';

@ApiTags('Images')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('images')
export class ImagesController {

  constructor(
    private imagesService: ImagesService
  ) { }

  @Get()
  @ApiQuery({
    name: "limit",
    description: "The maximum number of image to be requested (max: 10)",
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
    if (q >= 10) {
      q = 10
    }
    return await this.imagesService.requestImages(q, user)
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.USER, UserRole.ADMIN)
  async getImageById(
    @Param('id') imageID: number,
    @User() user: UserEntity
  ) {
    return await this.imagesService.getImageByID(imageID, user)
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.USER, UserRole.ADMIN)
  async updateImageById(
    @Param('id') imageID: number,
    @Body() dto: UpdateImageDTO,
    @User() user: UserEntity
  ) {
    return await this.imagesService.updateImageById(imageID, dto, user)
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.USER, UserRole.ADMIN)
  async createImage(
    @Body() dto: CreateImageDTO,
    @User() user: UserEntity
  ) {
    return await this.imagesService.createImage(dto, user)
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.USER, UserRole.ADMIN)
  async softDeleteImage(
    @Param('id') imageID: number,
    @User() user: UserEntity 
  ) {
    return await this.imagesService.softDeleteImage(imageID, user)
  }


}
