import { Module } from '@nestjs/common';
import { EventModule } from './event/event.module';
import { MessageModule } from './message/message.module';
import { PubSubModule } from './pubsub.module';

@Module({
  imports: [PubSubModule.forRoot(), EventModule, MessageModule],
})
export class AsyncApplicationModule {}
