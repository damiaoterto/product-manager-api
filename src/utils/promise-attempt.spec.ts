import { Logger } from '@nestjs/common';
import { promiseAttempt } from './promise-attempt';

const loggerErrorSpy = jest
  .spyOn(Logger.prototype, 'error')
  .mockImplementation(() => {});

describe('promiseAttempt', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should execute the promise successfully on the first attempt', async () => {
    const mockPromise = jest.fn().mockResolvedValue(undefined);
    const operationName = 'Successful Operation';

    await promiseAttempt(operationName, mockPromise);

    expect(mockPromise).toHaveBeenCalledTimes(1);
    expect(loggerErrorSpy).not.toHaveBeenCalled();
  });

  it('should retry the promise until it succeeds', async () => {
    const mockPromise = jest
      .fn()
      .mockRejectedValueOnce(new Error('Temporary failure'))
      .mockResolvedValueOnce(undefined);

    const operationName = 'Retry Operation';

    await promiseAttempt(operationName, mockPromise);

    expect(mockPromise).toHaveBeenCalledTimes(2);
    expect(loggerErrorSpy).toHaveBeenCalledTimes(1);
    expect(loggerErrorSpy).toHaveBeenCalledWith(
      `Error on run ${operationName} start attempt 1: Temporary failure`,
    );
  });

  it('should stop after reaching the default max attempts (5)', async () => {
    const persistentError = new Error('Persistent failure');
    const mockPromise = jest.fn().mockRejectedValue(persistentError);
    const operationName = 'Failing Operation';
    const defaultMaxAttempts = 5;

    await promiseAttempt(operationName, mockPromise);

    expect(mockPromise).toHaveBeenCalledTimes(defaultMaxAttempts);
    expect(loggerErrorSpy).toHaveBeenCalledTimes(defaultMaxAttempts);
    expect(loggerErrorSpy).toHaveBeenLastCalledWith(
      `Error on run ${operationName} start attempt 5: Persistent failure`,
    );
  });

  it('should stop after reaching a custom max attempts', async () => {
    const mockPromise = jest
      .fn()
      .mockRejectedValue(new Error('Another failure'));
    const operationName = 'Custom Attempts Operation';
    const customMaxAttempts = 3;

    await promiseAttempt(operationName, mockPromise, customMaxAttempts);

    expect(mockPromise).toHaveBeenCalledTimes(customMaxAttempts);
    expect(loggerErrorSpy).toHaveBeenCalledTimes(customMaxAttempts);
    expect(loggerErrorSpy).toHaveBeenLastCalledWith(
      `Error on run ${operationName} start attempt 3: Another failure`,
    );
  });
});
