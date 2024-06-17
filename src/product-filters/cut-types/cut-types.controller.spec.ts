import { Test, TestingModule } from '@nestjs/testing';
import { CutTypesController } from './cut-types.controller';
import { CutTypesService } from './cut-types.service';

describe('CutTypesController', () => {
  let controller: CutTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CutTypesController],
      providers: [CutTypesService],
    }).compile();

    controller = module.get<CutTypesController>(CutTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
