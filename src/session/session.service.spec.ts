import { Test, TestingModule } from '@nestjs/testing';
import { SessionService } from './session.service';
import { PrismaService } from '../prisma/prisma.service';

describe('SessionService', () => {
  let service: SessionService;
  let prisma: PrismaService;

  const mockPrismaService = {
    learningSession: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<SessionService>(SessionService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createSession', () => {
    it('should create a new session', async () => {
      const mockSession = {
        id: 'session-id',
        userId: 'user-id',
        topic: 'Math',
        duration: 45,
        date: new Date('2023-10-03'),
        notes: 'Reviewed calculus',
      };

      mockPrismaService.learningSession.create.mockResolvedValue(mockSession);

      const result = await service.addSession('user-id', {
        topic: 'Math',
        duration: 45,
        date: new Date('2023-10-03').toISOString(),
        notes: 'Reviewed calculus',
      });

      expect(result).toEqual(mockSession);
      expect(prisma.learningSession.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-id',
          topic: 'Math',
          duration: 45,
          date: new Date('2023-10-03'),
          notes: 'Reviewed calculus',
        },
      });
    });
  });
});
