import { DynamicModule, Global, Module, Provider, Type } from '@nestjs/common';
import { PubSub } from '@google-cloud/pubsub';

import {
  DEFAULT_PROJECT_NAME,
  GOOGLE_PUB_SUB_MODULE_ID,
  GOOGLE_PUB_SUB_MODULE_OPTIONS,
} from './google-pubsub.constants';
import {
  GooglePubSubModuleAsyncOptions,
  GooglePubSubModuleOptions,
  GooglePubSubOptionsFactory,
} from './interfaces';
import { generateString, getProjectNameToken } from './common';

@Global()
@Module({})
export class GooglePubSubCoreModule {
  static forRoot(options: GooglePubSubModuleOptions = {}): DynamicModule {
    const pubSubModuleOptions = {
      provide: GOOGLE_PUB_SUB_MODULE_OPTIONS,
      useValue: options,
    };
    const pubSubProvider = {
      provide: getProjectNameToken(options) as string,
      useFactory: () => this.createPubSubFactory(options),
    };

    return {
      module: GooglePubSubCoreModule,
      providers: [pubSubProvider, pubSubModuleOptions],
      exports: [pubSubProvider],
    };
  }

  static forRootAsync(options: GooglePubSubModuleAsyncOptions): DynamicModule {
    const pubSubProvider = {
      provide: getProjectNameToken(options) as string,
      useFactory: (pubSubOptions: GooglePubSubModuleOptions) => {
        return this.createPubSubFactory(pubSubOptions);
      },
      inject: [GOOGLE_PUB_SUB_MODULE_OPTIONS],
    };

    const asyncProviders = this.createAsyncProviders(options);
    return {
      module: GooglePubSubCoreModule,
      imports: options.imports,
      providers: [
        ...asyncProviders,
        pubSubProvider,
        {
          provide: GOOGLE_PUB_SUB_MODULE_ID,
          useValue: generateString(),
        },
      ],
      exports: [pubSubProvider],
    };
  }

  private static createAsyncProviders(
    options: GooglePubSubModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    const useClass = options.useClass as Type<GooglePubSubOptionsFactory>;
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: GooglePubSubModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: GOOGLE_PUB_SUB_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    // `as Type<PubSubOptionsFactory>` is a workaround for microsoft/TypeScript#31603
    const inject = [
      (options.useClass ||
        options.useExisting) as Type<GooglePubSubOptionsFactory>,
    ];
    return {
      provide: GOOGLE_PUB_SUB_MODULE_OPTIONS,
      useFactory: async (optionsFactory: GooglePubSubOptionsFactory) =>
        await optionsFactory.createGooglePubSubOptions(options.projectName),
      inject,
    };
  }

  private static createPubSubFactory(
    options: GooglePubSubModuleOptions,
  ): PubSub {
    let projectId = options.projectId;
    if (!projectId) {
      projectId = options.projectName;
    }
    if (!projectId) {
      projectId = DEFAULT_PROJECT_NAME;
    }
    return new PubSub({
      ...options,
      projectId,
    });
  }
}
