import { Injectable } from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class PasswordService {
  constructor() {}

  async encrypt(plainPassword: string) {
    // generate password hash
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(plainPassword, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');

    return result;
  }

  async verify(plainPassword: string, encryptedPassword: string) {
    const [salt, storedHash] = encryptedPassword.split('.');
    const hash = (await scrypt(plainPassword, salt, 32)) as Buffer;

    if (hash.toString('hex') === storedHash) {
      return Promise.resolve(true);
    }

    return Promise.resolve(false);
  }
}
