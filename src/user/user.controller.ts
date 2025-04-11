import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() dto: CreateUserDto) {
    const user = await this.userService.createUser(dto);
    return {
      success: true,
      data: user,
      message: 'User created successfully',
    };
  }

  @Get(':userId/streak')
  async getStreak(@Param('userId') userId: string) {
    const streak = await this.userService.getStreak(userId);
    return {
      success: true,
      data: streak,
      message: 'User streak retrieved successfully',
    };
  }

  @Get(':userId/summary')
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
  async getInsights(@Param('userId') userId: string) {
    const insights = await this.userService.getInsights(userId);
    return {
      success: true,
      data: insights,
      message: 'User insights retrieved successfully',
    };
  }
}