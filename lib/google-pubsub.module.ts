import { DynamicModule, Module, Provider, Type } from '@nestjs/common';
import { PubSub, Topic } from '@google-cloud/pubsub';

import { GooglePubSubCoreModule } from './google-pubsub-core.module';
import {
  GooglePubSubModuleAsyncOptions,
  GooglePubSubModuleOptions,
  GooglePubSubTopicAsyncOptions,
  GooglePubSubTopicOptions,
  GooglePubSubTopicOptionsFactory,
} from './interfaces';
import {
  DEFAULT_PROJECT_NAME,
  GOOGLE_PUB_SUB_TOPIC_OPTIONS,
} from './google-pubsub.constants';
import { getProjectNameToken, getTopicNameToken } from './common';

@Module({})
export class GooglePubSubModule {
  static forRoot(options: GooglePubSubModuleOptions): DynamicModule {
    return {
      module: GooglePubSubModule,
      imports: [GooglePubSubCoreModule.forRoot(options)],
    };
  }

  static forRootAsync(options: GooglePubSubModuleAsyncOptions): DynamicModule {
    return {
      module: GooglePubSubModule,
      imports: [GooglePubSubCoreModule.forRootAsync(options)],
    };
  }

  static forFeature(
    topicName: string,
    options: GooglePubSubTopicOptions | string = DEFAULT_PROJECT_NAME,
  ): DynamicModule {
    const topicProvider = {
      provide: getTopicNameToken(topicName, options),
      useFactory: (client: PubSub) => {
        let publishOptions;
        let name = topicName;
        if (typeof options === 'object') {
          publishOptions = options;
          if (options.topicName) {
            name = options.topicName;
          }
        }

        return this.createTopicFactory(client, name, publishOptions);
      },
      inject: [getProjectNameToken(options)],
    };

    return {
      module: GooglePubSubModule,
      providers: [topicProvider],
      exports: [topicProvider],
    };
  }

  static forFeatureAsync(
    options: GooglePubSubTopicAsyncOptions,
  ): DynamicModule {
    const topicProvider = {
      provide: getTopicNameToken(options.topicName, options),
      useFactory: (
        pubSubTopicOptions: GooglePubSubTopicOptions,
        client: PubSub,
      ) => {
        let name = options.topicName;
        if (pubSubTopicOptions.topicName) {
          name = pubSubTopicOptions.topicName;
        }

        return this.createTopicFactory(client, name, pubSubTopicOptions);
      },
      inject: [GOOGLE_PUB_SUB_TOPIC_OPTIONS, getProjectNameToken(options)],
    };

    const asyncProviders = this.createAsyncProviders(options);
    return {
      module: GooglePubSubModule,
      imports: options.imports,
      providers: [...asyncProviders, topicProvider],
      exports: [topicProvider],
    };
  }

  private static createAsyncProviders(
    options: GooglePubSubTopicAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    const useClass = options.useClass as Type<GooglePubSubTopicOptionsFactory>;
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: GooglePubSubTopicAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: GOOGLE_PUB_SUB_TOPIC_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    // `as Type<PubSubTopicOptionsFactory>` is a workaround for microsoft/TypeScript#31603
    const inject = [
      (options.useClass ||
        options.useExisting) as Type<GooglePubSubTopicOptionsFactory>,
    ];
    return {
      provide: GOOGLE_PUB_SUB_TOPIC_OPTIONS,
      useFactory: async (optionsFactory: GooglePubSubTopicOptionsFactory) =>
        await optionsFactory.createGooglePubSubTopicOptions(
          options.projectName,
        ),
      inject,
    };
  }

  private static createTopicFactory(
    client: PubSub,
    name: string,
    options?: GooglePubSubTopicOptions,
  ): Topic {
    return client.topic(name, options);
  }
}
