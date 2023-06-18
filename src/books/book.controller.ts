import { Controller, Get } from '@nestjs/common';
import { Book } from 'src/entities/book.entity';
import { BooksService } from './book.service';

@Controller('books')
export class BooksController {

  constructor(private readonly booksService: BooksService) {}

  @Get()
  async findAll(): Promise<Book[]> {
    return this.booksService.findAll();
  }
}
