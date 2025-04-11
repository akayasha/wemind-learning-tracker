import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException, BadRequestException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  const mockPrismaService = {
    user: {
      create: jest.fn(),
    },
    learningSession: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        createdAt: new Date(),
        updatedAt: new Date(),
      };      jest.spyOn(prisma.user, 'create').mockResolvedValue(mockUser);

      const result = await service.createUser(mockUser);
      expect(result).toEqual(mockUser);
      expect(prisma.user.create).toHaveBeenCalledWith({ data: mockUser });
    });

    it('should throw ConflictException on duplicate user', async () => {
      jest.spyOn(prisma.user, 'create').mockRejectedValue({ code: 'P2002' });

      await expect(service.createUser({ email: 'test@example.com', name: 'Test User' }))
        .rejects.toThrow(ConflictException);
    });
  });

  describe('getSummary', () => {
    it('should throw BadRequestException for invalid date range', async () => {
      await expect(service.getSummary('userId', 'invalid', 'invalid'))
        .rejects.toThrow(BadRequestException);
    });

    it('should return a summary of sessions', async () => {
      const mockSessions = [
        {
          id: '1',
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: 'userId',
          topic: 'Math',
          duration: 60,
          date: new Date('2023-10-01'),
          notes: 'Reviewed algebra',
        },
        {
          id: '2',
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: 'userId',
          topic: 'Science',
          duration: 30,
          date: new Date('2023-10-02'),
          notes: 'Studied physics',
        },
      ];
      jest.spyOn(prisma.learningSession, 'findMany').mockResolvedValue(mockSessions);

      const result = await service.getSummary('userId', '2023-10-01', '2023-10-02');
      expect(result).toEqual([
        { topic: 'Math', totalDuration: 60 },
        { topic: 'Science', totalDuration: 30 },
      ]);
    });
  });

  describe('getStreak', () => {
    it('should return the current streak and last active date', async () => {
      const mockSessions = [
        {
          id: '1',
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: 'userId',
          topic: 'Math',
          duration: 45,
          date: new Date('2023-10-02'),
          notes: null,
        },
        {
          id: '2',
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: 'userId',
          topic: 'Science',
          duration: 30,
          date: new Date('2023-10-01'),
          notes: null,
        },
      ];
      jest.spyOn(prisma.learningSession, 'findMany').mockResolvedValue(mockSessions);

      const result = await service.getStreak('userId');
      expect(result).toEqual({
        currentStreak: 2,
        lastActiveDate: '2023-10-02',
      });
    });
  });


  describe('getInsights', () => {
    it('should return user insights', async () => {
      const mockSessions = [
        {
          id: '1',
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: 'userId',
          topic: 'Math',
          duration: 45,
          date: new Date('2023-10-02'),
          notes: 'Reviewed calculus',
        },
        {
          id: '2',
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: 'userId',
          topic: 'Science',
          duration: 30,
          date: new Date('2023-10-01'),
          notes: 'Studied physics',
        },
      ];
      jest.spyOn(prisma.learningSession, 'findMany').mockResolvedValue(mockSessions);

      const result = await service.getInsights('userId');
      expect(result).toEqual({
        currentStreak: 2,
        longestStreak: 2,
        lastActiveDate: '2023-10-02',
        mostStudiedTopic: 'Math',
        totalMinutesThisWeek: 75,
        averageDailyMinutes: 37.5,
        recommendation: "You're doing great! Try not to miss tomorrow to keep your streak going.",
      });
    });
  });

});