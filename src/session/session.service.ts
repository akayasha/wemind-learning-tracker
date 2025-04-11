import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSessionDto } from './dto/create-session.dto';

@Injectable()
export class SessionService {
  constructor(private prisma: PrismaService) {
  }

  async addSession(userId: string, dto: CreateSessionDto) {
    const formattedDate = new Date(dto.date).toISOString().split('T')[0];
    return this.prisma.learningSession.create({
      data: {
        ...dto,
        userId,
        date: new Date(formattedDate),
      },
    });
  }

  async listSessions(userId: string) {
    const sessions = await this.prisma.learningSession.findMany({
      where: { userId },
      orderBy: { date: 'asc' },
      select: { topic: true, duration: true, date: true },
    });

    // Format the date to YYYY-MM-DD
    const formattedSessions = sessions.map((session) => ({
      ...session,
      date: session.date.toISOString().split('T')[0],
    }));

    // Get the last active date (most recent session date)
    const lastActiveDate = sessions.length
      ? sessions[sessions.length - 1].date.toISOString().split('T')[0]
      : null;

    return {
      sessions: formattedSessions,
      lastActiveDate,
    };
  }
}