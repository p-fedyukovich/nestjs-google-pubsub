import { Injectable } from '@nestjs/common';
import { InjectTopic } from '../../../lib';
import { Topic } from '@google-cloud/pubsub';
import { EVENT_TOPIC_NAME } from './event.constants';

@Injectable()
export class EventService {
  constructor(
    @InjectTopic(EVENT_TOPIC_NAME)
    private readonly eventTopic: Topic,
  ) {}
  async create(data: any): Promise<any> {
    await this.eventTopic.publishJSON(data);
    return {
      data,
      topicName: this.eventTopic.name,
      projectId: this.eventTopic.parent.projectId,
    };
  }
}
