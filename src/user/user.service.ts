import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // Create a new user
  async createUser(dto: CreateUserDto) {
    try {
      return await this.prisma.user.create({ data: dto });
    } catch (error) {
      // Handle unique constraint violation
      if (error.code === 'P2002') {
        throw new ConflictException("Data Can't Duplicate");
      }
      throw error;
    }
  }

  // Get a summary of sessions within a date range
  async getSummary(userId: string, from: string, to: string) {
    const fromDate = new Date(from);
    const toDate = new Date(to);

    // Validate date range
    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      throw new BadRequestException('Invalid date range provided.');
    }

    if (fromDate > toDate) {
      throw new BadRequestException('The "from" date cannot be later than the "to" date.');
    }

    // Fetch sessions within the date range
    const sessions = await this.prisma.learningSession.findMany({
      where: {
        userId,
        date: { gte: fromDate, lte: toDate },
      },
    });

    if (!sessions.length) {
      return [];
    }

    // Summarize session durations by topic
    const summary = sessions.reduce((acc, session) => {
      acc[session.topic] = (acc[session.topic] || 0) + session.duration;
      return acc;
    }, {});

    return Object.entries(summary).map(([topic, totalDuration]) => ({
      topic,
      totalDuration,
    }));
  }

  // Get the current streak and last active date
  async getStreak(userId: string) {
    const sessions = await this.prisma.learningSession.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });

    const streak = calculateStreak(sessions.map((s) => s.date));
    return {
      currentStreak: streak.count,
      lastActiveDate: streak.lastActiveDate,
    };
  }

  // Get insights for a user
  async getInsights(userId: string) {
    const sessions = await this.prisma.learningSession.findMany({
      where: { userId },
    });

    // Extract unique dates
    const dates = [
      ...new Set(sessions.map((s) => s.date.toISOString().split('T')[0])),
    ];

    // Calculate streak information
    const streakInfo = calculateStreak(sessions.map((s) => new Date(s.date)));

    // Calculate total duration
    const total = sessions.reduce((sum, s) => sum + s.duration, 0);

    // Calculate topic durations
    type TopicCountMap = Record<string, number>;
    const topicCount: TopicCountMap = sessions.reduce((acc, s) => {
      acc[s.topic] = (acc[s.topic] || 0) + s.duration;
      return acc;
    }, {} as TopicCountMap);

    // Determine the most studied topic
    const mostStudiedTopic = Object.entries(topicCount).sort(
      (a, b) => b[1] - a[1],
    )[0]?.[0];

    return {
      currentStreak: streakInfo.count,
      longestStreak: streakInfo.longest,
      lastActiveDate: streakInfo.lastActiveDate,
      mostStudiedTopic,
      totalMinutesThisWeek: total,
      averageDailyMinutes: dates.length > 0 ? total / dates.length : 0,
      recommendation:
        streakInfo.count > 0
          ? "You're doing great! Try not to miss tomorrow to keep your streak going."
          : "Let's get back on track today!",
    };
  }
}

// Helper function to calculate streaks
function calculateStreak(dates: Date[]) {
  let count = 0;
  let longest = 0;
  let lastActiveDate: string | null = null;
  const dateSet = new Set(dates.map((d) => d.toISOString().split('T')[0]));
  let current = new Date();

  // Iterate backward from the current date
  while (true) {
    const iso = current.toISOString().split('T')[0];
    if (dateSet.has(iso)) {
      count++;
      longest = Math.max(longest, count);
      lastActiveDate = iso;
    } else if (count > 0) {
      break;
    }
    current.setDate(current.getDate() - 1);
  }

  return { count, lastActiveDate, longest };
}