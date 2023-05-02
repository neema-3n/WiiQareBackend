import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Messaging } from './entities/messaging.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MessagingService {
  constructor(
    @InjectRepository(Messaging)
    private messagingRepository: Repository<Messaging>,
  ) {}

  /**
   * This method is used to send a message to a user
   * @param senderId
   * @param message
   */
  async sendMessage(senderId: string, message: string): Promise<Messaging> {
    const newMessage = this.messagingRepository.create({
      senderId,
      message,
      isFromUser: false,
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
      .where('senderId = :senderId', { senderId })
      .orWhere('recipientId = :recipientId', { recipientId: senderId })
      .getMany();
  }
}
