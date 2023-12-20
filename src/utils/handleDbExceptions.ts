import {
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

export const handleDbExceptions = (resource: string, error: any) => {
  const logger = new Logger(resource);
  if (error.code === '23505') {
    throw new BadRequestException(error.detail);
  }
  logger.error(error);
  throw new InternalServerErrorException(
    "Unexpected error. Please check the server's logs",
    error.message,
  );
};
