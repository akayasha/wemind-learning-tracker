import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUserService = {
    createUser: jest.fn(),
    getStreak: jest.fn(),
    getSummary: jest.fn(),
    getInsights: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call UserService.createUser and return the result', async () => {
      const mockUser = { id: '1', name: 'Test User', email: 'test@example.com' };
      mockUserService.createUser.mockResolvedValue(mockUser);

      const result = await controller.create({ name: 'Test User', email: 'test@example.com' });

      expect(result).toEqual({
        success: true,
        data: mockUser,
        message: 'User created successfully',
      });
      expect(service.createUser).toHaveBeenCalledWith({ name: 'Test User', email: 'test@example.com' });
    });
  });

  describe('getStreak', () => {
    it('should call UserService.getStreak and return the result', async () => {
      const mockStreak = { currentStreak: 5, lastActiveDate: '2023-10-03' };
      mockUserService.getStreak.mockResolvedValue(mockStreak);

      const result = await controller.getStreak('user-id');

      expect(result).toEqual({
        success: true,
        data: mockStreak,
        message: 'User streak retrieved successfully',
      });
      expect(service.getStreak).toHaveBeenCalledWith('user-id');
    });
  });

  describe('getSummary', () => {
    it('should call UserService.getSummary and return the result', async () => {
      const mockSummary = [{ topic: 'Math', totalDuration: 120 }];
      mockUserService.getSummary.mockResolvedValue(mockSummary);

      const result = await controller.getSummary('user-id', { from: '2023-10-01', to: '2023-10-31' });

      expect(result).toEqual({
        success: true,
        data: mockSummary,
        message: 'User summary retrieved successfully',
      });
      expect(service.getSummary).toHaveBeenCalledWith('user-id', '2023-10-01', '2023-10-31');
    });
  });

  describe('getInsights', () => {
    it('should call UserService.getInsights and return the result', async () => {
      const mockInsights = { mostStudiedTopic: 'Math', totalMinutesThisWeek: 300 };
      mockUserService.getInsights.mockResolvedValue(mockInsights);

      const result = await controller.getInsights('user-id');

      expect(result).toEqual({
        success: true,
        data: mockInsights,
        message: 'User insights retrieved successfully',
      });
      expect(service.getInsights).toHaveBeenCalledWith('user-id');
    });
  });
});