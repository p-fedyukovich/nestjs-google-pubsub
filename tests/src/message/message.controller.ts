import { Body, Controller, Get, Post } from '@nestjs/common';
import { MessageService } from './message.service';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  create(@Body() data: any): Promise<any> {
    return this.messageService.create(data);
  }
}
