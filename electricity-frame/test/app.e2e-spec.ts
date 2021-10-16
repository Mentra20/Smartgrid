import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { ElectricityFrameController } from 'src/electricity-frame/electricity-frame.controller';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let controller: ElectricityFrameController

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    controller = moduleFixture.get(ElectricityFrameController)
    await app.init();
  });

  it('do frame', () => {
    
    
});
})