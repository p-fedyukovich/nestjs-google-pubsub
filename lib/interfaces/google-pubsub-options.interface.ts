import { ModuleMetadata, Type } from '@nestjs/common';
import { ClientConfig } from '@google-cloud/pubsub/build/src/pubsub';
import { PublishOptions } from '@google-cloud/pubsub/build/src/publisher';

export type GooglePubSubModuleOptions = {
  projectName?: string;
} & Partial<ClientConfig>;

export type GooglePubSubTopicOptions = {
  topicName?: string;
  projectName?: string;
} & Partial<PublishOptions>;

export interface GooglePubSubOptionsFactory {
  createGooglePubSubOptions(
    projectName?: string,
  ): Promise<GooglePubSubModuleOptions> | GooglePubSubModuleOptions;
}

export interface GooglePubSubTopicOptionsFactory {
  createGooglePubSubTopicOptions(
    projectName?: string,
  ): Promise<GooglePubSubTopicOptions> | GooglePubSubTopicOptions;
}

export interface GooglePubSubModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  projectName?: string;
  useExisting?: Type<GooglePubSubOptionsFactory>;
  useClass?: Type<GooglePubSubOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<GooglePubSubModuleOptions> | GooglePubSubModuleOptions;
  inject?: any[];
}

export interface GooglePubSubTopicAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  topicName: string;
  projectName?: string;
  useExisting?: Type<GooglePubSubTopicOptionsFactory>;
  useClass?: Type<GooglePubSubTopicOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<GooglePubSubTopicOptions> | GooglePubSubTopicOptions;
  inject?: any[];
}
