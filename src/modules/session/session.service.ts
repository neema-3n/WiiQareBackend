import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

import {
  UserRole,
  UserStatus
} from 'src/common/constants/enums';
import { User } from 'src/modules/session/entities/user.entity';
import { Connection, FindOneOptions, Repository } from 'typeorm';
import { CreateSessionDto } from './dto/create-session.dto';
import { AppConfigService } from "../../config/app-config.service";
import { SessionResponseDto } from './dto/session.dto';
import { _404 } from 'src/common/constants/errors';
import { JwtClaimsDataDto } from './dto/jwt-claims-data.dto';

@Injectable()
export class SessionService {

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
    private readonly connection: Connection,
    private readonly appConfigService: AppConfigService,
  ) {
  }

  async authenticateUser(payload: CreateSessionDto): Promise<SessionResponseDto> {

    const { password, phoneNumber, username, email } = payload;

    const user = await this.userRepository.findOne({ where: { phoneNumber }, relations: ['payer'] });

    if (!user) throw new NotFoundException(_404.USER_NOT_FOUND);

    const jwtClaimsData = {
      sub: user.id,
      type: user.role,
      phoneNumber: user.phoneNumber,
      names: 'add name here!',
      status: user.status,
    } as JwtClaimsDataDto;

    const jsonWebToken = this.jwtService.sign(jwtClaimsData);

    return {
      access_token: jsonWebToken,
    } as SessionResponseDto;
  }


  /**
   * This function find one user!
   */
  async findOne(options: FindOneOptions<User>): Promise<User | undefined> {

    const user = await this.userRepository.findOne(options);

    if (!user) throw new NotFoundException(_404.USER_NOT_FOUND);

    return user;
  }

}
