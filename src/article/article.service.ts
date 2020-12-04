import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from 'src/entities/article.entity';
import { Repository } from 'typeorm';

import { UserEntity } from 'src/entities/user.entity';
import { CreateArticleDTO, UpdateArticleDTO } from '../models/article.model';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private articleRepo: Repository<ArticleEntity>,
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
  ) {}

  findBySlug(slug: string) {
    return this.articleRepo.findOne({ where: { slug } });
  }

  private ensureOwnership(user: UserEntity, article: ArticleEntity): boolean {
    return article.author.id === user.id;
  }

  async createArticle(user: UserEntity, data: CreateArticleDTO) {
    const article = this.articleRepo.create(data);
    article.author = user;
    const { slug } = await article.save();

    return (await this.articleRepo.findOne({ slug })).toArticle(user);
  }

  async updateAricle(slug: string, user: UserEntity, data: UpdateArticleDTO) {
    const article = await this.findBySlug(slug);
    if (!this.ensureOwnership(user, article)) {
      throw new UnauthorizedException();
    }
    await this.articleRepo.update({ slug }, data);
    return article.toArticle(user);
  }

  async deleteArticle(slug: string, user: UserEntity) {
    const article = await this.findBySlug(slug);
    if (!this.ensureOwnership(user, article)) {
      throw new UnauthorizedException();
    }
    await this.articleRepo.remove(article);
  }
}
