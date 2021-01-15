import { Module } from '@nestjs/common';
import { GooglePubSubModule } from '../../../lib';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { EVENT_TOPIC_NAME } from './event.constants';

@Module({
  imports: [GooglePubSubModule.forFeature(EVENT_TOPIC_NAME)],
  providers: [EventService],
  controllers: [EventController],
})
export class EventModule {}
