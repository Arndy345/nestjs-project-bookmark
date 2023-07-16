import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma';
@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}
  async getBookmarks(userId) {
    const bookmarks =
      await this.prisma.bookmark.findMany({
        where: { userId },
      });
    if (bookmarks) {
      return bookmarks;
    }
    return 'No bookmarks yet';
  }

  async createBookmark(id, dto) {
    const bookmarks =
      await this.prisma.bookmark.create({
        data: {
          userId: id,
          ...dto,
        },
      });
    if (bookmarks) {
      return bookmarks;
    }
    throw new InternalServerErrorException(
      'Internal Server Error',
    );
  }

  async getBookmarkById(userId, bookmarkId) {
    const bookmark =
      await this.prisma.bookmark.findFirst({
        where: {
          userId,
          id: bookmarkId,
        },
      });
    if (bookmark) {
      return bookmark;
    }
    throw new ForbiddenException(
      'Resource not found',
    );
  }

  async editBookmarkById(
    userId,
    bookmarkId,
    dto,
  ) {
    // const bookmark =
    //   await this.prisma.bookmark.update({
    //     where: {
    //       userIdentifier: {
    //         userId,
    //         id: bookmarkId,
    //       },
    //     },
    //     data: {
    //       ...dto,
    //     },
    //   };
    const bookmark =
      await this.prisma.bookmark.findUnique({
        where: { id: bookmarkId },
      });

    if (!bookmark || bookmark.userId !== userId) {
      throw new ForbiddenException(
        'Resource not found',
      );
    }

    return await this.prisma.bookmark.update({
      where: {
        id: bookmarkId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteBookmarkById(userId, bookmarkId) {
    const bookmark =
      await this.prisma.bookmark.findUnique({
        where: { id: bookmarkId },
      });

    if (!bookmark || bookmark.userId !== userId) {
      throw new ForbiddenException(
        'Resource not found',
      );
    }

    await this.prisma.bookmark.delete({
      where: {
        id: bookmarkId,
      },
    });
    return 'Deleted Succesfully';
  }
}
