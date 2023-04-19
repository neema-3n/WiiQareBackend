import { BaseEntity } from 'src/db/base-entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Transaction extends BaseEntity {
  @Column({ comment: 'sent amount before conversion' })
  senderAmount: number;

  @Column()
  senderCurrency: string;

  @Column({
    comment: 'This is the actual amount in local currency patient receives',
  })
  amount: number;

  @Column({
    comment: 'This rate of exchange at the time of the transaction',
  })
  conversionRate: number;

  @Column({ comment: 'local currency' })
  currency: string;

  @Column()
  senderId: string;

  //TODO: @remove nullable later!
  @Column({ nullable: true })
  patientId: string;

  @Column()
  status: string;

  @Column()
  transactionHash: string;

  @Column()
  stripePaymentId: string;

  @Column({ type: 'jsonb' })
  voucher: Record<string, any>;
}
