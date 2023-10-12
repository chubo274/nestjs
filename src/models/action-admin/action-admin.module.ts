import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { ActionAdminService } from './action-admin.service';

@Module({
  controllers: [],
  providers: [ActionAdminService],
  imports: [PrismaModule],
})
export class ActionAdminModule { }
