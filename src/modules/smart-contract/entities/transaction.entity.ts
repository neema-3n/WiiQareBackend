import { BaseEntity } from 'src/db/base-entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Transaction extends BaseEntity {
  @Column({
    type: 'double precision',
    comment: 'sent amount before conversion',
  })
  senderAmount: number;

  @Column()
  senderCurrency: string;

  @Column({
    type: 'double precision',
    comment: 'This is the actual amount in local currency patient receives',
  })
  amount: number;

  @Column({
    type: 'double precision',
    comment: 'This rate of exchange at the time of the transaction',
  })
  conversionRate: number;

  @Column({ comment: 'local currency' })
  currency: string;

  @Column({ type: 'uuid', nullable: true })
  senderId: string;

  //TODO: @remove nullable later!
  @Column({ type: 'uuid', nullable: true })
  patientId: string;

  @Column()
  status: string;

  @Column()
  transactionHash: string;

  //TODO: @remove nullable later!
  @Column({ nullable: true })
  shortenHash: string;

  @Column()
  stripePaymentId: string;

  @Column({ type: 'jsonb' })
  voucher: Record<string, any>;
}
