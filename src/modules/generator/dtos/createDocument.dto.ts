import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsString,
} from 'class-validator';

export class createDocumentDTO {
  @IsString()
  @IsNotEmpty()
  templateId: string;
  @IsNotEmpty()
  @IsObject()
  @IsNotEmptyObject()
  documentData: any;
}
