import { BusinessType } from 'src/common/constants/enums';
import { BaseEntity } from 'src/db/base-entity';
import { Column, Entity } from 'typeorm';
import { ContactPersonDto } from '../dto/provider.dto';

@Entity()
export class Provider extends BaseEntity {
  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  address: string;

  @Column()
  phone: string;

  @Column()
  city: string;

  @Column()
  postalCode: string;

  @Column()
  nationalId: string;

  @Column({ comment: 'registered company number' })
  businessRegistrationNo: number;

  @Column({ type: 'enum', enum: BusinessType })
  businessType: BusinessType;

  @Column()
  logoLink: string;

  @Column({ type: 'json', nullable: true })
  contactPerson?: ContactPersonDto;
}
