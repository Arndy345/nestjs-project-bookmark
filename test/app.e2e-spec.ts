import * as request from 'supertest';
import {
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { AppModule } from '../src';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../src/prisma';
import { EditUserDto } from 'src/user/dto/edit-user.dto';
import {
  BookmarkDto,
  EditBookmarkDto,
} from 'src/bookmark/dto';

describe('App e2e', () => {
  // let token: string;
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef =
      await Test.createTestingModule({
        imports: [AppModule],
      }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true }),
    );
    await app.init();
    prisma = app.get(PrismaService);
    await prisma.cleanDb();
  });
  describe('Auth', () => {
    describe('SignUp', () => {
      it('/POST user Create', () => {
        return request(app.getHttpServer())
          .post('/auth/signup')
          .send({
            email: 'nonso1@gmail.com',
            password: '1234',
          })
          .expect(201);
      });
      it('should throw an error if email && password is not provided', () => {
        return request(app.getHttpServer())
          .post('/auth/signin')
          .send({
            // email: 'nonso1@gmail.com',
            // password: '1234',
          })
          .expect(400);
      });
      it('should throw an error if password is not provided', () => {
        return request(app.getHttpServer())
          .post('/auth/signin')
          .send({
            email: 'nonso1@gmail.com',
            // password: '1234',
          })
          .expect(400);
      });
      it('should throw an error if email is not provided', () => {
        return request(app.getHttpServer())
          .post('/auth/signin')
          .send({
            // email: 'nonso1@gmail.com',
            password: '1234',
          })
          .expect(400);
      });
    });

    describe('SignIn', () => {
      it('/Post user login', () => {
        return request(app.getHttpServer())
          .post('/auth/signin')
          .send({
            email: 'nonso1@gmail.com',
            password: '1234',
          })
          .expect(200);
      });
      it('should throw an error if email && password is not provided', () => {
        return request(app.getHttpServer())
          .post('/auth/signin')
          .send({})
          .expect(400);
      });
      it('should throw an error if password is not provided', () => {
        return request(app.getHttpServer())
          .post('/auth/signin')
          .send({
            email: 'nonso1@gmail.com',
            // password: '1234',
          })
          .expect(400);
      });
      it('should throw an error if email is not provided', () => {
        return request(app.getHttpServer())
          .post('/auth/signin')
          .send({
            //  email: 'nonso1@gmail.com',
            password: '1234',
          })
          .expect(400);
      });
      it('should throw an error if email is incorrect', () => {
        return request(app.getHttpServer())
          .post('/auth/signin')
          .send({
            email: 'nonso1gmail.com',
            password: '1234',
          })
          .expect(400);
      });
    });
  });
  describe('Bookmark', () => {
    let bookmarkId = 2;
    let token = 'hey';
    beforeAll(async () => {
      return request(app.getHttpServer())
        .post('/auth/signin')
        .send({
          email: 'nonso1@gmail.com',
          password: '1234',
        })
        .then((body) => {
          token = body.body.access_token;
        });
    });
    it('/POST creates new bookmark', () => {
      const dto: BookmarkDto = {
        title: 'Arena in here',
        description: 'Here we go',
        link: 'github.com',
      };
      return request(app.getHttpServer())
        .post('/bookmarks/')
        .set('Authorization', `Bearer ${token}`)
        .send(dto)
        .expect(201)
        .then((data) => {
          bookmarkId = data.body.id;
        });
    });
    it('/POST should return error when user is not authenticated', () => {
      const dto: BookmarkDto = {
        title: 'Arena in here',
        description: 'Here we go',
        link: 'github.com',
      };
      return request(app.getHttpServer())
        .get('/bookmarks')
        .set('Authorization', `Bearer token`)
        .send(dto)
        .expect(401);
    });
    it('/GET bookmark', () => {
      return request(app.getHttpServer())
        .get('/bookmarks/')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });
    it('/GET bookmark by id', () => {
      return request(app.getHttpServer())
        .get(`/bookmarks/${bookmarkId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });
    it('/GET bookmark by id fails when wrong ID is passed', () => {
      return request(app.getHttpServer())
        .get(`/bookmarks/10`)
        .set('Authorization', `Bearer ${token}`)
        .expect(403);
    });
    it('/PATCH updates bookmark details', () => {
      const dto: EditBookmarkDto = {
        title: 'testing123@gmai.com',
        description: 'Here we go',
        link: 'github.com',
      };
      return request(app.getHttpServer())
        .patch(`/bookmarks/${bookmarkId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(dto)
        .expect(200);
    });
    it('/DELETE bookmark', () => {
      return request(app.getHttpServer())
        .delete(`/bookmarks/${bookmarkId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });
    it('/GET should return empty bookmark after deleting', async () => {
      const response = await request(
        app.getHttpServer(),
      )
        .get('/bookmarks/')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.length).toStrictEqual(
        0,
      );
    });
  });
  describe('User', () => {
    let token = 'hey';
    beforeAll(async () => {
      return request(app.getHttpServer())
        .post('/auth/signin')
        .send({
          email: 'nonso1@gmail.com',
          password: '1234',
        })
        .then((body) => {
          token = body.body.access_token;
        });
    });

    it('/GET user', () => {
      return request(app.getHttpServer())
        .get('/users/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });

    it('/PATCH updates user details', () => {
      const dto: EditUserDto = {
        email: 'testing123@gmai.com',
        firstName: 'Tested',
      };
      return request(app.getHttpServer())
        .patch('/users/me')
        .set('Authorization', `Bearer ${token}`)
        .send(dto)
        .expect(200);
    });
  });

  afterAll(() => {
    app.close();
  });
});
