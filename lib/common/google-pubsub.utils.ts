import { PubSub } from '@google-cloud/pubsub';
import { Type } from '@nestjs/common';
import { DEFAULT_PROJECT_NAME } from '../google-pubsub.constants';
import { v4 as uuid } from 'uuid';
import {
  GooglePubSubModuleAsyncOptions,
  GooglePubSubModuleOptions,
  GooglePubSubTopicOptions,
} from '../interfaces';

export function getProjectNameToken(
  projectNameOrOptions:
    | GooglePubSubModuleOptions
    | GooglePubSubModuleAsyncOptions
    | string = DEFAULT_PROJECT_NAME,
): string | Type<PubSub> {
  if (DEFAULT_PROJECT_NAME === projectNameOrOptions) {
    return PubSub;
  } else {
    if ('string' === typeof projectNameOrOptions) {
      return `${projectNameOrOptions}_project`;
    } else {
      if (
        DEFAULT_PROJECT_NAME === projectNameOrOptions.projectName ||
        !projectNameOrOptions.projectName
      ) {
        return PubSub;
      } else {
        return `${projectNameOrOptions.projectName}_project`;
      }
    }
  }
}

export const generateString: () => string = () => uuid();

export function getTopicNameToken(
  topic: string,
  projectNameOrOptions:
    | GooglePubSubTopicOptions
    | string = DEFAULT_PROJECT_NAME,
): string {
  const projectPrefix = getProjectPrefix(projectNameOrOptions);
  return `${projectPrefix}${topic}_topic`;
}

export function getProjectPrefix(
  projectNameOrOptions:
    | GooglePubSubModuleOptions
    | string = DEFAULT_PROJECT_NAME,
): string {
  if (projectNameOrOptions === DEFAULT_PROJECT_NAME) {
    return '';
  }
  if (typeof projectNameOrOptions === 'string') {
    return projectNameOrOptions + '_';
  }
  if (
    projectNameOrOptions.projectName === DEFAULT_PROJECT_NAME ||
    !projectNameOrOptions.projectName
  ) {
    return '';
  }
  return projectNameOrOptions.projectName + '_';
}
