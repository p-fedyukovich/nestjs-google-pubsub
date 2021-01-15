import { Body, Controller, Post } from '@nestjs/common';
import { EventService } from './event.service';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  create(@Body() data: any): Promise<any> {
    return this.eventService.create(data);
  }
}
