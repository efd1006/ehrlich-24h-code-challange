import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CloudinaryService } from '../../shared/libs/cloudinary/cloudinary.service';
import { PexelsService } from '../../shared/libs/pexels/pexels.service';
import { UserRole } from '../user/enums';
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
      dataToReturn.push({ id: image.id, hits: image.hits, uri: image.uri })
    })

    return {
      limit: limit,
      data: dataToReturn
    }
  }

  async getImageByID(id: number, user: UserEntity) {

    // check if user role is admin or user for specific query
    let q = (user.role == UserRole.USER) ? { id: id, owner_id: user.id } : { id: id } 

    let image = await this.imageRepository.findOne({ where: q })

    if (!image) {
      throw new HttpException("Image not found", HttpStatus.NOT_FOUND)
    }

    // increment hits property by one before returning
    await this.imageRepository.update({ id: image.id }, { hits: image.hits + 1 })

    // query again to get the updated data
    image = await this.imageRepository.findOne({ where: q })

    return image

  }
}
