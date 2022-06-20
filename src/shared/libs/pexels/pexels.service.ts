import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import 'dotenv/config';


@Injectable()
export class PexelsService {

	constructor(
		private readonly httpService: HttpService
	) { }

	async getRandomImages(limit: number): Promise<IPexelCuratedImageResponse> {
		const response = await this.httpService.axiosRef.get(`${process.env.PEXELS_ENDPOINT}/v1/curated?per_page=${limit}`, {
			headers: {
				"Authorization": process.env.PEXELS_API_KEY
			}
		})

		return response.data;
	}
}
