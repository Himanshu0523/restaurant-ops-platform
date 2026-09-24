import { Controller, Get, Head } from '@nestjs/common';
import { AppService } from './app.service.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Head()
  getHealth() {
    return {
      status: 'ok',
      service: 'Servio Restaurant API',
      timestamp: new Date().toISOString(),
    };
  }
}
