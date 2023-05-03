import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Messaging } from './entities/messaging.entity';
import { Repository } from 'typeorm';
import { APP_NAME } from '../../common/constants/constants';
import { User } from '../session/entities/user.entity';
import { _404 } from '../../common/constants/errors';
import { JwtClaimsDataDto } from '../session/dto/jwt-claims-data.dto';

@Injectable()
export class MessagingService {
  constructor(
    @InjectRepository(Messaging)
    private messagingRepository: Repository<Messaging>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * This method is used to send a message to a user
   * @param senderId
   * @param message
   * @param authUser
   */
  async sendMessage(
    senderId: string,
    message: string,
    authUser: JwtClaimsDataDto,
  ): Promise<Messaging> {
    const user = await this.userRepository.findOne({ where: { id: senderId } });

    if (!user) throw new NotFoundException(_404.USER_NOT_FOUND);

    const newMessage = this.messagingRepository.create({
      senderId,
      senderName: authUser.names,
      message,
      isFromUser: true,
      recipientId: APP_NAME,
      recipientName: APP_NAME,
    });
    return this.messagingRepository.save(newMessage);
  }

  /**
   * This method is used to list all messages sent to a user
   * @param senderId
   */
  async listRecipientMessages(senderId: string): Promise<Messaging[]> {
    return this.messagingRepository
      .createQueryBuilder()
      .where('sender_id = :senderId', { senderId })
      .orWhere('recipient_id = :recipientId', { recipientId: senderId })
      .getMany();
  }
}
