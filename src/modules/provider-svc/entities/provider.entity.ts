import { BaseEntity } from 'src/db/base-entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Provider extends BaseEntity {
  @Column()
  name: string;

  //TODO: adds other fields remaining
}
