import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";

export class DeleteManyWithIdsDto {
    @ApiProperty({ type: [String] })
    @IsNotEmpty({ each: true })
    @IsUUID("all", { each: true })
    ids: string[]
}

export class DeleteManyWithSlugsDto {
    @ApiProperty({ type: [String] })
    @IsNotEmpty({ each: true })
    slugs: string[]
}