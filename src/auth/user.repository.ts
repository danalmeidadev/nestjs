import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { compare, hash } from 'bcryptjs';
import { AuthCredentialsDTO } from './dtos/auth-credentials.dto';
import { User } from './entities/user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentialsDTO: AuthCredentialsDTO): Promise<void> {
    const { username, email, password } = authCredentialsDTO;
    const userExiste = await this.findOne({
      where: { email },
    });

    if (userExiste) {
      throw new ConflictException('O email informado já está cadastrado');
    }

    const hashPassword = await hash(password, 10);
    const user = this.create({
      username,
      email,
      password: hashPassword,
    });
    await user.save();
  }

  async validateUser(authCredentialsDTO: AuthCredentialsDTO): Promise<User> {
    const { password, email } = authCredentialsDTO;

    const user = await this.findOne({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Ooops, Usuario ou senha incorretos!');
    }

    const passwordMatched = await compare(password, user.password);
    if (!passwordMatched) {
      throw new UnauthorizedException('Ooops, Usuario ou senha incorretos!');
    }

    return user;
  }
}
