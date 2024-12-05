import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigService } from 'nestjs-config';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { PrismaModule, PrismaService } from 'nestjs-prisma';

@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory: (config: ConfigService) => config.get('file'),
      inject: [ConfigService],
    }),
    PrismaModule
  ],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
