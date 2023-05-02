import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { SendMessageDto } from './dto/message.dto';
import { Roles } from '../../common/decorators/user-role.decorator';
import { UserRole } from '../../common/constants/enums';
import { AuthUser } from '../../common/decorators/auth-user.decorator';
import { JwtClaimsDataDto } from '../session/dto/jwt-claims-data.dto';
import { MessagingService } from './messaging.service';
import { _403 } from '../../common/constants/errors';

@Controller('messaging')
export class MessagingController {
  constructor(private readonly messagingService: MessagingService) {}

  @Get()
  @ApiOperation({ summary: 'List all messages from a specific user' })
  @Roles(UserRole.PATIENT, UserRole.PROVIDER, UserRole.PAYER)
  findAll(
    @Query('senderId') senderId: string,
    @AuthUser() authUser: JwtClaimsDataDto,
  ) {
    // check if is a patient and if the user is the same as the one in the url
    if (
      [UserRole.PATIENT, UserRole.PAYER, UserRole.PROVIDER].includes(
        authUser.type,
      ) &&
      authUser.sub !== senderId
    )
      throw new ForbiddenException(_403.ACCESS_NOT_ALLOWED);
    return this.messagingService.listRecipientMessages(senderId);
  }

  @Post('send')
  @ApiOperation({ summary: 'Send a message to WiiQare Team' })
  @Roles(UserRole.PATIENT)
  send(
    @Body() sendMessageDto: SendMessageDto,
    @AuthUser() authUser: JwtClaimsDataDto,
  ) {
    const { senderId, message } = sendMessageDto;
    return this.messagingService.sendMessage(senderId, message);
  }
}
