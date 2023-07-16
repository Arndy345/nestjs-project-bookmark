import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  ParseIntPipe,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '../auth';
import { BookmarkService } from './bookmark.service';
import { GetUser } from 'src/auth/decorators';
import {
  BookmarkDto,
  EditBookmarkDto,
} from './dto';

@UseGuards(AuthGuard)
@Controller('bookmarks')
export class BookmarkController {
  constructor(
    private bookmarkService: BookmarkService,
  ) {}
  @Get()
  getBookmarks(@GetUser('sub') id: number) {
    return this.bookmarkService.getBookmarks(id);
  }

  @Post()
  createBookmark(
    @GetUser('sub') id: number,
    @Body() dto: BookmarkDto,
  ) {
    return this.bookmarkService.createBookmark(
      id,
      dto,
    );
  }

  @Get(':id')
  getBookmarkById(
    @GetUser('sub') id: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return this.bookmarkService.getBookmarkById(
      id,
      bookmarkId,
    );
  }

  @Patch(':id')
  editBookmarkById(
    @GetUser('sub') id: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
    @Body() dto: EditBookmarkDto,
  ) {
    return this.bookmarkService.editBookmarkById(
      id,
      bookmarkId,
      dto,
    );
  }

  @Delete(':id')
  deleteBookmarkById(
    @GetUser('sub') id: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return this.bookmarkService.deleteBookmarkById(
      id,
      bookmarkId,
    );
  }
}
