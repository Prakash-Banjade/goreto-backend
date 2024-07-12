import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { QueryDto } from "src/core/dto/query.dto";

export class CategoryQueryDto extends QueryDto {
    @ApiPropertyOptional({ type: Boolean })
    @IsString()
    @IsOptional()
    onlyParents?: string = 'false'
}