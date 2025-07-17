import { describe, beforeEach, afterEach, it, expect } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { OpenApiService } from './openapi.service';

const mockDocumentBuilder = {
  setTitle: jest.fn().mockReturnThis(),
  build: jest.fn().mockReturnValue({ title: 'Mock Document' }),
};

jest.mock('@nestjs/swagger', () => ({
  SwaggerModule: {
    setup: jest.fn(),
    createDocument: jest.fn(),
  },

  DocumentBuilder: jest.fn(() => mockDocumentBuilder),
}));

describe('OpenApiService', () => {
  let service: OpenApiService;
  let mockApp: INestApplication;

  const originalNodeEnv = process.env.NODE_ENV;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OpenApiService],
    }).compile();

    service = module.get<OpenApiService>(OpenApiService);
    mockApp = { get: jest.fn() } as unknown as INestApplication;
  });

  afterEach(() => {
    jest.clearAllMocks();
    process.env.NODE_ENV = originalNodeEnv;
  });

  describe('When in production environment', () => {
    it('should not initialize Swagger', () => {
      process.env.NODE_ENV = 'production';

      service.init(mockApp);

      expect(DocumentBuilder).not.toHaveBeenCalled();
      expect(SwaggerModule.setup).not.toHaveBeenCalled();
    });
  });

  describe('When in a non-production environment', () => {
    it('should initialize Swagger with the correct configuration', () => {
      process.env.NODE_ENV = 'development';

      service.init(mockApp);

      expect(DocumentBuilder).toHaveBeenCalledTimes(1);
      expect(mockDocumentBuilder.setTitle).toHaveBeenCalledWith(
        'Product Manager',
      );
      expect(mockDocumentBuilder.build).toHaveBeenCalledTimes(1);

      expect(SwaggerModule.setup).toHaveBeenCalledTimes(1);
      expect(SwaggerModule.setup).toHaveBeenCalledWith(
        'swagger',
        mockApp,
        expect.any(Function),
      );
    });

    it('should create a document when the factory function is called', () => {
      process.env.NODE_ENV = 'test';

      service.init(mockApp);

      const documentFactory = (SwaggerModule.setup as jest.Mock).mock
        .calls[0][2];
      documentFactory();

      expect(SwaggerModule.createDocument).toHaveBeenCalledTimes(1);
    });
  });
});
