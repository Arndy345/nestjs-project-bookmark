import * as request from 'supertest';
import {
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { AppModule } from '../src';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../src/prisma';
import { EditUserDto } from 'src/user/dto/edit-user.dto';

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

    beforeEach(() => {});

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

  describe('Bookmark', () => {
    describe('Create bookmarks', () => {});
    describe('Get bookmarks', () => {});

    describe('Get bookmarks by Id', () => {});

    describe('Edit bookmarks', () => {});

    describe('Delete bookmarks', () => {});
  });

  afterAll(() => {
    app.close();
  });
});
