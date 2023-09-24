import { BaseEntity } from '../../../db/base-entity';
import { Saving } from '../../saving/entities/saving.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

export enum OperationType {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
}

@Entity('operation_savings')
export class OperationSaving extends BaseEntity {
  @ManyToOne(() => Saving, (saving) => saving.operations)
  @JoinColumn({ name: 'idSaving' })
  saving: Saving;

  @Column({
    type: 'enum',
    enum: OperationType,
  })
  type: OperationType;

  @Column({ type: 'float' })
  amount: number;

  @Column()
  currency: string;
}
