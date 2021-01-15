import { Injectable } from '@nestjs/common';
import { InjectTopic } from '../../../lib';
import { Topic } from '@google-cloud/pubsub';

@Injectable()
export class MessageService {
  constructor(
    @InjectTopic('message', 'project2')
    private readonly messageTopic: Topic,
  ) {}
  async create(data: any): Promise<any> {
    await this.messageTopic.publishJSON(data);
    return {
      data,
      topicName: this.messageTopic.name,
      projectId: this.messageTopic.parent.projectId,
    };
  }
}
