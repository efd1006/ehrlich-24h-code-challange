import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { PexelsModule } from '../../shared/libs/pexels/pexels.module';
import { CloudinaryModule } from '../../shared/libs/cloudinary/cloudinary.module';

@Module({
  imports: [
    PexelsModule,
    CloudinaryModule
  ],
  providers: [ImagesService],
  controllers: [ImagesController]
})
export class ImagesModule {}
