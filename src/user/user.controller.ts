import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async create(@Body() dto: CreateUserDto) {
    const user = await this.userService.createUser(dto);
    return {
      success: true,
      data: user,
      message: 'User created successfully',
    };
  }

  @Get(':userId/streak')
  @ApiOperation({ summary: 'Get user streak' })
  @ApiParam({ name: 'userId', description: 'ID of the user' })
  @ApiResponse({ status: 200, description: 'User streak retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getStreak(@Param('userId') userId: string) {
    const streak = await this.userService.getStreak(userId);
    return {
      success: true,
      data: streak,
      message: 'User streak retrieved successfully',
    };
  }

  @Get(':userId/summary')
  @ApiOperation({ summary: 'Get user session summary' })
  @ApiParam({ name: 'userId', description: 'ID of the user' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        from: { type: 'string', example: '2023-10-01', description: 'Start date (YYYY-MM-DD)' },
        to: { type: 'string', example: '2023-10-31', description: 'End date (YYYY-MM-DD)' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'User summary retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Invalid date range' })
  async getSummary(
    @Param('userId') userId: string,
    @Body() body: { from: string; to: string },
  ) {
    const summary = await this.userService.getSummary(userId, body.from, body.to);
    return {
      success: true,
      data: summary,
      message: 'User summary retrieved successfully',
    };
  }

  @Get(':userId/insights')
  @ApiOperation({ summary: 'Get user insights' })
  @ApiParam({ name: 'userId', description: 'ID of the user' })
  @ApiResponse({ status: 200, description: 'User insights retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getInsights(@Param('userId') userId: string) {
    const insights = await this.userService.getInsights(userId);
    return {
      success: true,
      data: insights,
      message: 'User insights retrieved successfully',
    };
  }
}