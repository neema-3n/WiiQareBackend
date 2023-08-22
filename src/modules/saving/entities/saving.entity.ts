import { BaseEntity } from '../../../db/base-entity';
import { OperationSaving } from '../../operation-saving/entities/operation.entity';
import { User } from '../../session/entities/user.entity';
import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

export enum SavingType {
  PourMoi = 'MOI',
  Famille = 'FAMILLE',
  Enfant = 'ENFANT',
  FemmeEnceinte = 'FEMME ENCEINTE',
  Diabetique = 'DIABÉTIQUE',
  Hypertendu = 'HYPER TENDU',
}

export enum SavingFrequency {
  day = 'DAY',
  week = 'WEEK',
  month = 'MONTH',
}

@Entity()
export class Saving extends BaseEntity {
  @ManyToOne(() => User, (user) => user.savings)
  @JoinColumn({ name: 'idUser' })
  user: User;

  @Column({
    type: 'enum',
    enum: SavingType,
    default: SavingType.PourMoi,
  })
  type: SavingType;

  @Column()
  amount: number;

  @Column()
  currency: string;

  @Column({
    type: 'enum',
    enum: SavingFrequency,
    default: SavingFrequency.day,
  })
  frequency: SavingFrequency;

  @OneToMany(() => OperationSaving, (operation) => operation.saving, {
    nullable: true,
  })
  operations: Saving[];
}
