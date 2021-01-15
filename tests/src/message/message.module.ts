import { Module } from '@nestjs/common';
import { GooglePubSubModule } from '../../../lib';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';

@Module({
  imports: [
    GooglePubSubModule.forFeature('message', {
      projectName: 'project2',
    }),
  ],
  providers: [MessageService],
  controllers: [MessageController],
})
export class MessageModule {}
