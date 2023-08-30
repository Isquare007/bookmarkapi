import {
  Controller,
  Get,
  Patch,
  Post,
  Delete,
  UseGuards,
  Param,
  ParseIntPipe,
  Body,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { jwtGuard } from '../auth/guard/jwt.guard';
import { BookmarkService } from '../bookmark/bookmark.service';
import { CreateBookmarkDto, EditBookmarkDto } from './dto/bookmark.dto';
import { GetUser } from '../auth/decorator/user.decorator';

@UseGuards(jwtGuard)
@Controller('bookmarks')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  @Get()
  getBookmarks(@GetUser('id') userId: number) {
    return this.bookmarkService.getBookmarks(userId);
  }

  @Get(':id')
  getBookmarkById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return this.bookmarkService.getBookmarkById(userId, bookmarkId);
  }

  @Patch(':id')
  editBookmarkById(
    @GetUser('id') userId: number,
    @Body() dto: EditBookmarkDto,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return this.bookmarkService.editBookmarkById(userId, bookmarkId, dto);
  }

  @Post()
  createBookmark(
    @Body() dto: CreateBookmarkDto,
    @GetUser('id') userId: number,
  ) {
    return this.bookmarkService.createBookmark(userId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteBookmark(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return this.bookmarkService.deleteBookmark(userId, bookmarkId);
  }
}
