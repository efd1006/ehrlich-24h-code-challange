import { Injectable } from '@nestjs/common';
import { CloudinaryService } from '../../shared/libs/cloudinary/cloudinary.service';
import { PexelsService } from '../../shared/libs/pexels/pexels.service';

@Injectable()
export class ImagesService {

	constructor(
		private pexelService: PexelsService,
		private cloudinaryService: CloudinaryService
	) { }

	async requestImages(limit: number) {
		const pexelData = await this.pexelService.getRandomImages(limit)
		const cloudinaryResult = await this.cloudinaryService.uploadToCloudinary(pexelData)
		return cloudinaryResult
	}
}
