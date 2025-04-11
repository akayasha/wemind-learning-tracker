import { Test, TestingModule } from '@nestjs/testing';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';

describe('SessionController', () => {
  let controller: SessionController;
  let service: SessionService;

  const mockSessionService = {
    addSession: jest.fn(),
    listSessions: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SessionController],
      providers: [
        {
          provide: SessionService,
          useValue: mockSessionService,
        },
      ],
    }).compile();

    controller = module.get<SessionController>(SessionController);
    service = module.get<SessionService>(SessionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('add', () => {
    it('should call SessionService.addSession and return the result', async () => {
      const mockSession = { id: '1', topic: 'Math', duration: 60, date: '2023-10-03', notes: 'Reviewed algebra' };
      mockSessionService.addSession.mockResolvedValue(mockSession);

      const result = await controller.add('user-id', {
        topic: 'Math',
        duration: 60,
        date: '2023-10-03',
        notes: 'Reviewed algebra',
      });

      expect(result).toEqual({
        success: true,
        data: mockSession,
        message: 'Session added successfully',
      });
      expect(service.addSession).toHaveBeenCalledWith('user-id', {
        topic: 'Math',
        duration: 60,
        date: '2023-10-03',
        notes: 'Reviewed algebra',
      });
    });
  });

  describe('list', () => {
    it('should call SessionService.listSessions and return the result', async () => {
      const mockSessions = [
        { id: '1', topic: 'Math', duration: 60, date: '2023-10-03', notes: 'Reviewed algebra' },
        { id: '2', topic: 'Science', duration: 30, date: '2023-10-04', notes: 'Studied physics' },
      ];
      mockSessionService.listSessions.mockResolvedValue(mockSessions);

      const result = await controller.list('user-id');

      expect(result).toEqual({
        success: true,
        data: mockSessions,
        message: 'Sessions retrieved successfully',
      });
      expect(service.listSessions).toHaveBeenCalledWith('user-id');
    });
  });
});