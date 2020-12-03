import {
  Entity,
  Column,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  RelationCount,
} from 'typeorm';
import * as slugify from 'slug';
import { AbstractEntity } from './abstract-entity';
import { UserEntity } from './user.entity';
import { classToPlain } from 'class-transformer';

@Entity('articles')
export class ArticleEntity extends AbstractEntity {
  @Column()
  slug: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  body: string;

  @ManyToMany((type) => UserEntity, (user) => user.favorites, { eager: true })
  @JoinColumn()
  favoritedBy: UserEntity[];

  @RelationCount((article: ArticleEntity) => article.favoritedBy)
  favoritesCount: number;

  @Column('simple-array')
  tagList: string[];

  @ManyToOne((type) => UserEntity, (user) => user.articles, { eager: true })
  author: UserEntity;

  @BeforeInsert()
  generateSlug() {
    this.slug =
      slugify(this.title, { lower: true }) +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
  }

  toJSON() {
    return classToPlain(this);
  }

  toArticle(user: UserEntity) {
    let favorited = null;
    if (user) {
      favorited = this.favoritedBy.includes(user);
    }
    const article: any = this.toJSON();
    delete article.favoritedBy;
    return { ...article, favorited };
  }
}
