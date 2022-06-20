import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary'
import 'dotenv/config'

@Injectable()
export class CloudinaryService {

	constructor() {
		cloudinary.config({
			cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
			api_key: process.env.CLOUDINARY_API_KEY,
			api_secret: process.env.CLOUDINARY_API_SECRET
		})
	}

	async uploadToCloudinary(pexelData: IPexelCuratedImageResponse): Promise<ICloudinaryResponse[]> {
		let results: ICloudinaryResponse[] = []
		for (let i = 0; i < pexelData.photos.length; i++) {
			let result = await this.uploadImage(pexelData.photos[i].src.small)
			results.push(result)
		}
		return results;
	}

	async uploadImage(url: string): Promise<ICloudinaryResponse> {
		return new Promise((resolve, reject) => {
			cloudinary.uploader.upload(url, function (error, result: ICloudinaryResponse) {
				if (result) {
					return resolve(result)
				}
			});
		})
	}

}
