import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { SessionService } from './session.service';
import { CreateSessionDto } from './dto/create-session.dto';

@Controller('users/:userId/sessions')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post()
  async add(@Param('userId') userId: string, @Body() dto: CreateSessionDto) {
    const session = await this.sessionService.addSession(userId, dto);
    return {
      success: true,
      data: session,
      message: 'Session added successfully',
    };
  }

  @Get()
  async list(@Param('userId') userId: string) {
    const sessions = await this.sessionService.listSessions(userId);
    return {
      success: true,
      data: sessions,
      message: 'Sessions retrieved successfully',
    };
  }
}