import { Module } from '@nestjs/common';
import { GooglePubSubModule } from '../../lib';
import { EventModule } from './event/event.module';
import { MessageModule } from './message/message.module';

@Module({
  imports: [
    GooglePubSubModule.forRoot({}),
    GooglePubSubModule.forRoot({
      projectName: 'project2',
    }),
    EventModule,
    MessageModule,
  ],
})
export class ApplicationModule {}
