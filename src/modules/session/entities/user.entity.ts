import { UserRole, UserStatus } from 'src/common/constants/enums';
import { BaseEntity } from 'src/db/base-entity';
import { Column, Entity } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class User extends BaseEntity {
  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ unique: true, nullable: true })
  phoneNumber: string;

  @Column({ unique: true, nullable: true })
  username: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.PATIENT })
  role: UserRole;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.INACTIVE })
  status: UserStatus;

  @Exclude()
  @Column({ nullable: true, select: false })
  password: string;

  //TODO: adds fields for google and apple authentication!
}
