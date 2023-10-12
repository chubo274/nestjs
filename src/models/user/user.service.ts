import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) { }
  async create(args: Prisma.UserCreateArgs) {
    return this.prismaService.user.create(args);
  }

  async findAll(args: Prisma.UserFindManyArgs) {
    return this.prismaService.user.findMany(args);
  }

  async count(args: Prisma.UserCountArgs) {
    return this.prismaService.user.count(args);
  }

  async findOne(args: Prisma.UserFindFirstArgs) {
    return this.prismaService.user.findFirst(args);
  }

  async update(where: Prisma.UserWhereUniqueInput, dto: Prisma.UserUpdateInput) {
    return this.prismaService.user.update({ where: where, data: dto });
  }
}
