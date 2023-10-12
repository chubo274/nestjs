import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ActionAdminService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(args: Prisma.ActionAdminCreateArgs) {
    return this.prismaService.actionAdmin.create(args);
  }
}
