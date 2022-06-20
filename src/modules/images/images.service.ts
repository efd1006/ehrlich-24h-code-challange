import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CloudinaryService } from '../../shared/libs/cloudinary/cloudinary.service';
import { PexelsService } from '../../shared/libs/pexels/pexels.service';
import { UserEntity } from '../user/user.entity';
import { CreateImageDTO } from './dto';
import { ImageEntity } from './image.entity';

@Injectable()
export class ImagesService {

  constructor(
    private pexelService: PexelsService,
    private cloudinaryService: CloudinaryService,
    @InjectRepository(ImageEntity) private imageRepository: Repository<ImageEntity>
  ) { }

  async requestImages(limit: number, user: UserEntity) {
    const pexelData = await this.pexelService.getRandomImages(limit)
    const cloudinaryResult = await this.cloudinaryService.uploadToCloudinary(pexelData)
    // return cloudinaryResult

    let datas: CreateImageDTO[] = []
    let dataToReturn = []

    for (let i = 0; i < cloudinaryResult.length; i++) {
      let obj: CreateImageDTO = {
        owner_id: user.id,
        uri: cloudinaryResult[i].secure_url,
        hits: 1,
        cloudinary_public_id: cloudinaryResult[i].public_id
      }
      datas.push(obj)
    }

    const images = await this.imageRepository.create(datas)
    await this.imageRepository.save(images)
    
    images.forEach(image => {
      dataToReturn.push({id: image.id, hits: image.hits, uri: image.uri})
    })

    return {
      limit: limit,
      data: dataToReturn
    }    
  }
}
