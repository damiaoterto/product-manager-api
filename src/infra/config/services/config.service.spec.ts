import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { ConfigService } from './config.service';

const mockNestConfigService = {
  get: jest.fn(),
};

describe('ConfigService', () => {
  let service: ConfigService;
  let nestConfigService: NestConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        {
          provide: NestConfigService,
          useValue: mockNestConfigService,
        },
      ],
    }).compile();

    service = module.get<ConfigService>(ConfigService);
    nestConfigService = module.get<NestConfigService>(NestConfigService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('get', () => {
    it('should return the value when the key exists', () => {
      const key = 'DATABASE_URL';
      const value = 'postgresql://user:pass@localhost:5432/db';
      mockNestConfigService.get.mockReturnValue(value);

      const result = service.get(key);

      expect(nestConfigService.get).toHaveBeenCalledWith(key);
      expect(result).toBe(value);
    });

    it('should return undefined when the key does not exist', () => {
      const key = 'NON_EXISTENT_KEY';
      mockNestConfigService.get.mockReturnValue(undefined);

      const result = service.get(key);

      expect(nestConfigService.get).toHaveBeenCalledWith(key);
      expect(result).toBeUndefined();
    });

    it('should return a typed value correctly', () => {
      const key = 'PORT';
      const value = 3000;
      mockNestConfigService.get.mockReturnValue(value);

      const result = service.get<number>(key);

      expect(nestConfigService.get).toHaveBeenCalledWith(key);
      expect(result).toBe(value);
      expect(typeof result).toBe('number');
    });
  });
});
