import { Logger } from '@nestjs/common';

export async function promiseAttempt(
  name: string,
  promise: () => Promise<void>,
  maxAttempts = 5,
) {
  const logger = new Logger();
  let attemptCounter = 0;

  while (attemptCounter < maxAttempts) {
    try {
      attemptCounter++;
      await promise();
      break;
    } catch (error) {
      logger.error(
        `Error on run ${name} start attempt ${attemptCounter}: ${error.message}`,
      );
    }
  }
}
