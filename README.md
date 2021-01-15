# NestJS Google Pub/Sub module

[![p-fedyukovich](https://circleci.com/gh/p-fedyukovich/nestjs-google-pubsub.svg?style=svg)](https://circleci.com/gh/p-fedyukovich/nestjs-google-pubsub)

A Google Cloud Pub/Sub library for the [NestJS](https://github.com/nestjs/nest) framework.

## Features

- Pub/Sub configuration via several ways (sync/async/factory/existing)
- Decorators for injecting clients and topics
- Support multiple projects

## Installation

**Yarn**

```bash
yarn add nestjs-google-pubsub-module
```

**NPM**

```bash
npm install nestjs-google-pubsub-module
```

## Usage

Once the installation process is complete, we can import the `GooglePubSubModule` into the root `AppModule`.

```ts
import { Module } from '@nestjs/common';
import { GooglePubSubModule } from 'nestjs-google-pubsub-module';

@Module({
  imports: [
    GooglePubSubModule.forRoot({
      projectName: 'gcp-project'
    }),
  ],
})
export class AppModule {}
```

The `forRoot()` method supports all the configuration properties exposed by the PubSub constructor. 
In addition, there is `projectName` configuration property which is used as alias name for a project.

**Important**: Default project name will be used it's not provided.

Once this is done, the PubSub object will be available to inject across the entire project (without needing to import any modules), for example:

```ts
import { Injectable } from '@nestjs/common';
import { PubSub } from '@google-cloud/pubsub';

@Injectable()
export class AppService {
  constructor(private pubsub: PubSub) {}
}
```

### Topics

Once PubSub module is configured, we can set a topic up.

```ts
import { Module } from '@nestjs/common';
import { GooglePubSubModule } from 'nestjs-google-pubsub-module';

@Module({
  imports: [
    GooglePubSubModule.forRoot({
      projectName: 'gcp-project'
    }),
    GooglePubSubModule.forFeature('event_topic', {
      projectName: 'gcp-project',
    }),
  ],
})
export class AppModule {}
```

The `forFeature` method applies two arguments. The first is a topic name, and the second - option which supports all 
the configuration properties exposed by Topic publish options.
In addition, there are extra configuration properties described below.

* `projectName` - name of the project for which topic will be configured (default: `default_project`)

Once this is done, as well as the PubSub object the Topic object will be available to inject across the entire project 
(without needing to import any modules), for example:

```ts
import { Injectable } from '@nestjs/common';
import { InjectTopic } from 'nestjs-google-pubsub-module';
import { Topic } from '@google-cloud/pubsub';

@Injectable()
export class AppService {
  constructor(
    @InjectTopic('event_topic')
    private readonly eventTopic: Topic
  ) {}
}
```
