import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Server } from 'http';
import * as request from 'supertest';
import { AsyncApplicationModule } from '../src/app-async.module';

describe('Google PubSub (async configuration)', () => {
  let server: Server;
  let app: INestApplication;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AsyncApplicationModule],
    }).compile();

    app = module.createNestApplication();
    server = app.getHttpServer();
    await app.init();
  });

  it(`should return published event`, () => {
    const eventId = 1;

    return request(server)
      .post('/event')
      .send({ eventId })
      .expect(201)
      .expect((res) => {
        if (res.body.topicName !== 'projects/default_project/topics/event')
          throw new Error('invalid topic name');
        if (res.body.projectId !== 'default_project')
          throw new Error('invalid project');
        if (res.body.data.eventId !== eventId) {
          throw new Error('invalid event id');
        }
      });
  });

  it(`should return published message`, () => {
    const messageId = 1;

    return request(server)
      .post('/message')
      .send({ messageId })
      .expect(201)
      .expect((res) => {
        if (res.body.topicName !== 'projects/project2/topics/message') {
          throw new Error('invalid topic name');
        }
        if (res.body.projectId !== 'project2') {
          throw new Error('invalid project');
        }
        if (res.body.data.messageId !== messageId) {
          throw new Error('invalid message id');
        }
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
