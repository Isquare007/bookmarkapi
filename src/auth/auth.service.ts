import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto, SignupDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async signup(dto: SignupDto) {
    try {
      const hash = await argon.hash(dto.password);

      const user = await this.prisma.user.create({
        data: {
          firstName: dto.firstName,
          lastName: dto.lastName,
          email: dto.email,
          hash,
        },
      });

      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials Already Exist');
        }
      }
      throw error;
    }
  }

  async signin(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) {
      throw new ForbiddenException('Incorrect Credentials');
    }

    const passCheck = await argon.verify(user.hash, dto.password);

    if (!passCheck) {
      throw new ForbiddenException('Incorrect Credentials');
    }

    return this.signToken(user.id, user.email);
  }

  async signToken(userId: number, email: String): Promise<{access_token: String}> {
    const payload = {
      sub: userId,
      email,
    };
    const signature = this.config.get('JWT_KEY');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '60m',
      secret: signature,
    });

    return { access_token: token, };
  }
}
