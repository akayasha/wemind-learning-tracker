import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { SessionService } from './session.service';
import { CreateSessionDto } from './dto/create-session.dto';

@ApiTags('sessions')
@Controller('users/:userId/sessions')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post()
  @ApiOperation({ summary: 'Add a new session for a user' })
  @ApiParam({ name: 'userId', description: 'ID of the user' })
  @ApiResponse({ status: 201, description: 'Session added successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async add(@Param('userId') userId: string, @Body() dto: CreateSessionDto) {
    const session = await this.sessionService.addSession(userId, dto);
    return {
      success: true,
      data: session,
      message: 'Session added successfully',
    };
  }

  @Get()
  @ApiOperation({ summary: 'List all sessions for a user' })
  @ApiParam({ name: 'userId', description: 'ID of the user' })
  @ApiResponse({ status: 200, description: 'Sessions retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found or no sessions available' })
  async list(@Param('userId') userId: string) {
    const sessions = await this.sessionService.listSessions(userId);
    return {
      success: true,
      data: sessions,
      message: 'Sessions retrieved successfully',
    };
  }
}