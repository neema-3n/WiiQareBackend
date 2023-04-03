import { BaseEntity } from 'src/db/base-entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Transaction extends BaseEntity {
  //TODO: adds other fields later!.
  @Column()
  amount: number;

  @Column()
  senderId: string;

  @Column()
  currency: string;

  @Column()
  status: string;

  @Column()
  transactionHash: string;

  @Column()
  stripePaymentId: string;

  @Column({ type: 'jsonb' })
  voucher: Record<string, any>;
}
