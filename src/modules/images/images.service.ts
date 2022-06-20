import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CloudinaryService } from '../../shared/libs/cloudinary/cloudinary.service';
import { PexelsService } from '../../shared/libs/pexels/pexels.service';
import { UserRole } from '../user/enums';
import { UserEntity } from '../user/user.entity';
import { CreateImageDTO, ImageDTO, UpdateImageDTO } from './dto';
import { ImageEntity } from './image.entity';

@Injectable()
export class ImagesService {

  constructor(
    private pexelService: PexelsService,
    private cloudinaryService: CloudinaryService,
    @InjectRepository(ImageEntity) private imageRepository: Repository<ImageEntity>,
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>
  ) { }

  async requestImages(limit: number, user: UserEntity) {
    const pexelData = await this.pexelService.getRandomImages(limit)
    const cloudinaryResult = await this.cloudinaryService.uploadMulti(pexelData)


    let datas: ImageDTO[] = []
    let dataToReturn = []

    for (let i = 0; i < cloudinaryResult.length; i++) {
      let obj: ImageDTO = {
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

    // check if user role is admin or user for specific query since there are only two roles we can use this approach for simplicity and fast development
    let q = (user.role == UserRole.USER) ? { id: id, owner_id: user.id } : { id: id }

    let image = await this.imageRepository.findOne({ select: ['id', 'hits', 'uri'], where: q, withDeleted: user.role == UserRole.ADMIN ? true : false })

    if (!image) {
      throw new HttpException("Image not found", HttpStatus.NOT_FOUND)
    }

    // increment hits property by one before returning
    await this.imageRepository.update({ id: image.id }, { hits: image.hits + 1 })

    // query again to get the updated data
    image = await this.imageRepository.findOne({ select: ['id', 'hits', 'uri'], where: q, withDeleted: user.role == UserRole.ADMIN ? true : false })

    return image
  }

  async updateImageById(id: number, dto: UpdateImageDTO, user: UserEntity) {
    // check if user role is admin or user for specific query since there are only two roles we can use this approach for simplicity and fast development
    let q = (user.role == UserRole.USER) ? { id: id, owner_id: user.id } : { id: id }

    let image = await this.imageRepository.findOne({ select: ['id', 'hits', 'uri'], where: q, withDeleted: user.role == UserRole.ADMIN ? true : false })

    if (!image) {
      throw new HttpException("Image not found", HttpStatus.NOT_FOUND)
    }

    // increment hits property by one before returning
    await this.imageRepository.update({ id: image.id }, { hits: image.hits + 1, uri: dto.uri })

    // query again to get the updated data
    image = await this.imageRepository.findOne({ select: ['id', 'hits', 'uri'], where: q, withDeleted: user.role == UserRole.ADMIN ? true : false })

    return image

  }

  async createImage(dto: CreateImageDTO, user: UserEntity) {
    /***
     * @params owner_id, image
     * Checks if the user is admin, if true, then it checks if the dto.owner_id exists in users, if the dto.owener_id exists then assign the owner_id to that user
     * Otherwise, just assign the currently logged user id
     * */
    let image: ImageDTO
    let owner_id: string
    if (user.role == UserRole.ADMIN) {
      if (dto.owner_id) {
        const owner = await this.userRepository.findOne({ where: { id: dto.owner_id } }).catch(e => { throw new HttpException("Owner not found", HttpStatus.NOT_FOUND) }) // we need to catch the error is somebody passed invalid uuid, could be handled in a better way
        if (!owner) {
          throw new HttpException("Owner not found", HttpStatus.NOT_FOUND)
        }
        owner_id = owner.id
      } else {
        // for admin role
        owner_id = user.id
      }
    } else {
      // for user role
      owner_id = user.id
    }

    let cloudinaryResult
    try {
      cloudinaryResult = await this.cloudinaryService.uploadSingle(dto.uri)
    } catch (e) {
      console.log(e)
      throw new HttpException(e.message, Number(e.http_code))
    }

    image = {
      ...image,
      owner_id: owner_id,
      uri: dto.uri,
      hits: 1,
      cloudinary_public_id: cloudinaryResult.public_id
    }

    const result = await this.imageRepository.create(image)
    await this.imageRepository.save(result)

    return result
  }

  async softDeleteImage(id: number, user: UserEntity) {
    // check if user role is admin or user for specific query since there are only two roles we can use this approach for simplicity and fast development
    let q = (user.role == UserRole.USER) ? { id: id, owner_id: user.id } : { id: id }

    let image = await this.imageRepository.findOne({ where: q })

    if(!image) {
      throw new HttpException("Image not found", HttpStatus.NOT_FOUND)
    }

    const res = await this.imageRepository.softDelete(image.id)
    if (!res.affected) {
      throw new HttpException("Image not found", HttpStatus.NOT_FOUND)
    }

    return { deleted: true }
  }

}
