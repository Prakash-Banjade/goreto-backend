import { Test, TestingModule } from '@nestjs/testing';
import { CutTypesService } from './cut-types.service';

describe('CutTypesService', () => {
  let service: CutTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CutTypesService],
    }).compile();

    service = module.get<CutTypesService>(CutTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
