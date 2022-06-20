import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PexelsService } from './pexels.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5
    })
  ],
  providers: [PexelsService],
  exports: [PexelsService, HttpModule]
})
export class PexelsModule { }
