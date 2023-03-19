import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class createDocumentDTO {
  @IsString()
  @IsNotEmpty()
  templateId: string;
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  docTimeOut: number;
  @IsNotEmpty()
  @IsObject()
  @IsNotEmptyObject()
  documentData: any;
}
