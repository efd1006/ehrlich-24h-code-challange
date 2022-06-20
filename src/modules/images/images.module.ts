import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { PexelsModule } from '../../shared/libs/pexels/pexels.module';
import { CloudinaryModule } from '../../shared/libs/cloudinary/cloudinary.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageEntity } from './image.entity';
import { UserEntity } from '../user/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ImageEntity, UserEntity]),
    PexelsModule,
    CloudinaryModule
  ],
  providers: [ImagesService],
  controllers: [ImagesController]
})
export class ImagesModule {}
