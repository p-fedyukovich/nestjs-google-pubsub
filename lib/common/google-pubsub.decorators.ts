import { Inject } from '@nestjs/common';
import { getProjectNameToken, getTopicNameToken } from './google-pubsub.utils';
import { DEFAULT_PROJECT_NAME } from '../google-pubsub.constants';

export const InjectPubSub: (projectName: string) => ParameterDecorator = (
  projectName: string = DEFAULT_PROJECT_NAME,
) => Inject(getProjectNameToken(projectName));

export const InjectTopic: (
  topicName: string,
  projectName: string,
) => ParameterDecorator = (
  topicName: string,
  projectName: string = DEFAULT_PROJECT_NAME,
) => Inject(getTopicNameToken(topicName, projectName));
