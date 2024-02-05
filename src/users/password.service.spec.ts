import { Test, TestingModule } from '@nestjs/testing';
import { PasswordService } from './password.service';
import { BadRequestException } from '@nestjs/common';

describe('PasswordService', () => {
  let passwordService: PasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordService],
    }).compile();

    passwordService = module.get<PasswordService>(PasswordService);
  });



  it('should be defined', () => {
    expect(passwordService).toBeDefined();
  });



  it('[encrypt] should encrypt password with salt', async () => {
    const encryptedPassword = await passwordService.encrypt('12345678');

    expect(encryptedPassword).not.toEqual('12345678');
    const [salt, hash] = encryptedPassword.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('[encrypt] should throw a BadRequestException if password is less than 7 characters', async () => {
    await expect(passwordService.encrypt('')).rejects.toThrow(BadRequestException);
    await expect(passwordService.encrypt('123456')).rejects.toThrow(BadRequestException);
  });



  it('[verify] should verify passwords', async () => {
    const plainPassword = '12345678';
    const encryptedPassword = await passwordService.encrypt(plainPassword);

    let result = await passwordService.verify(plainPassword, encryptedPassword);
    expect(result).toEqual(true);

    result = await passwordService.verify('123', '123')
    expect(result).toEqual(false);
  });
});
