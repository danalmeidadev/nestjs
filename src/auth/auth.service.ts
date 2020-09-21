import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { AuthCredentialsDTO } from './dtos/auth-credentials.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentials: AuthCredentialsDTO): Promise<void> {
    return this.userRepository.signUp(authCredentials);
  }

  async signIn(
    authCredentials: AuthCredentialsDTO,
  ): Promise<{ accessToken: string }> {
    const user = await this.userRepository.validateUser(authCredentials);
    if (!user) {
      throw new UnauthorizedException(
        'Ooops, Usuario ou senha incorretos service!',
      );
    }
    const payload = { email: user.email };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }
}
