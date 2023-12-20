import {
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { handleDbExceptions } from '../handleDbExceptions';

describe('handleDbExceptions', () => {
  it('should throw BadRequestException if error code is 23505', () => {
    const error = { code: '23505', detail: 'Duplicate key violation' };
    expect(() => handleDbExceptions('testResource', error)).toThrow(
      BadRequestException,
    );
  });

  it('should throw InternalServerErrorException for other error codes', () => {
    const error = { code: 'random code', message: 'Some unexpected error' };
    expect(() => handleDbExceptions('testResource', error)).toThrow(
      InternalServerErrorException,
    );
  });

  it('should log error using Logger for all cases', () => {
    const error = {
      code: 'another random code',
      message: 'Some unexpected error',
    };
    const loggerSpy = jest.spyOn(Logger.prototype, 'error');

    try {
      handleDbExceptions('testResource', error);
    } catch (e) {}

    expect(loggerSpy).toHaveBeenCalledWith(error);
  });
});
