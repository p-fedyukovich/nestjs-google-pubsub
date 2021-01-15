import { Module } from '@nestjs/common';
import {
  GooglePubSubModule,
  GooglePubSubModuleOptions,
  GooglePubSubOptionsFactory,
} from '../../lib';
import { EventModule } from './event/event.module';
import { MessageModule } from './message/message.module';

class ConfigService implements GooglePubSubOptionsFactory {
  createGooglePubSubOptions(projectName?: string): GooglePubSubModuleOptions {
    return {};
  }
}

@Module({
  imports: [
    GooglePubSubModule.forRootAsync({
      useClass: ConfigService,
    }),
    GooglePubSubModule.forRoot({ projectName: 'project2' }),
    EventModule,
    MessageModule,
  ],
})
export class AsyncOptionsClassModule {}
