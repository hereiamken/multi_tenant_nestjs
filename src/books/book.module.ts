import { Module } from '@nestjs/common';
import { TenantModule } from '../tenant/tenant.module';
import { BooksController } from './book.controller';
import { BooksService } from './book.service';

@Module({
  imports: [
    TenantModule,
  ],
  controllers: [
    BooksController
  ],
  providers: [
    BooksService
  ]
})
export class BooksModule {}