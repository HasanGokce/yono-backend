import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

import { CmsService } from './cms.service';

@Module({
  imports: [ConfigModule, HttpModule],
  providers: [CmsService],
  exports: [CmsService],
})
export class CmsModule {}
