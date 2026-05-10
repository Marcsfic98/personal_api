import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class Bcrypt {
  async encryptPassword(Password: string): Promise<string> {
    const jumps: number = 10;
    return await bcrypt.hash(Password, jumps);
  }

  async comparePasswords(
    Passwordtyped: string,
    Passworddatabase: string,
  ): Promise<boolean> {
    return await bcrypt.compare(Passwordtyped, Passworddatabase);
  }
}
