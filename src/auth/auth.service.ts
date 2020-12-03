import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { RegisterDTO, LoginDTO } from 'src/models/user.dto';

@Injectable()
export class AuthService {
  private mockUser = {
    email: 'yongjoo@gmail.com',
    token: 'jwt.token.here',
    username: 'yongjoo',
    bio: 'I work at Nearthlab',
    imagee: null,
  };

  register(credentials: RegisterDTO) {
    return this.mockUser;
  }

  login(credentials: LoginDTO) {
    if (credentials.email === this.mockUser.email) {
      return this.mockUser;
    }
    throw new InternalServerErrorException();
  }
}
