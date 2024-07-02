import { Injectable } from '@nestjs/common';
import { CreateAttributeOptionSkusDto } from './dto/create-attribute-option-skus.dto';
import { UpdateAttributeOptionSkusDto } from './dto/update-attribute-option-skus.dto';

@Injectable()
export class AttributeOptionSkusService {
  create(createAttributeOptionSkusDto: CreateAttributeOptionSkusDto) {
    return 'This action adds a new attributeOptionSkus';
  }

  findAll() {
    return `This action returns all attributeOptionSkus`;
  }

  findOne(id: string) {
    return `This action returns a #${id} attributeOptionSkus`;
  }

  update(id: string, updateAttributeOptionSkusDto: UpdateAttributeOptionSkusDto) {
    return `This action updates a #${id} attributeOptionSkus`;
  }

  remove(id: string) {
    return `This action removes a #${id} attributeOptionSkus`;
  }
}
