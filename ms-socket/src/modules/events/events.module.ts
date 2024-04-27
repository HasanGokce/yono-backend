import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { HttpModule } from '@nestjs/axios';
import { CmsModule } from '../cms/cms.module';

@Module({
  imports: [HttpModule, CmsModule],
  providers: [EventsGateway],
})

export class EventsModule {}
