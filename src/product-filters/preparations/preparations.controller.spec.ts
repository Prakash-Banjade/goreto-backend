import { Test, TestingModule } from '@nestjs/testing';
import { PreparationsController } from './preparations.controller';
import { PreparationsService } from './preparations.service';

describe('PreparationsController', () => {
  let controller: PreparationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PreparationsController],
      providers: [PreparationsService],
    }).compile();

    controller = module.get<PreparationsController>(PreparationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
