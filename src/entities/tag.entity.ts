import { AbstractEntity } from './abstract-entity';
import { Entity, Column } from 'typeorm';

@Entity('tags')
export class TagEntity extends AbstractEntity {
  @Column()
  tag: string;

  toJSON() {
    return this.tag;
  }
}
