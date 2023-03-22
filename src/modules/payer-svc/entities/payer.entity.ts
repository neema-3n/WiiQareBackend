import { BaseEntity } from 'src/db/base-entity';
import { User } from 'src/modules/session/entities/user.entity';
import { Column, Entity, OneToOne, JoinColumn } from 'typeorm';

@Entity()
export class Payer extends BaseEntity {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @OneToOne(() => User, { cascade: ['insert', 'update'] })
  @JoinColumn()
  user: User;

  @Column()
  country: string;

  @Column({ nullable: true })
  homeAddress?: string;

  @Column({ nullable: true })
  province?: string;

  @Column({ nullable: true })
  city?: string;
}
