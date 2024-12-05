import { Module } from '@nestjs/common';
import { FieldsService } from './fields.service';
import { FieldsController } from './fields.controller';
import { PrismaModule, PrismaService } from 'nestjs-prisma';

@Module({
  imports: [
    PrismaModule
  ],
  controllers: [FieldsController],
  providers: [FieldsService],

})
export class FieldsModule {}
