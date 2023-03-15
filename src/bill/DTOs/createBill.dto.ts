import { Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class client {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  docType: string;
  @IsString()
  @IsNotEmpty()
  docNumber: string;
}
class item {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  item: string;
  @IsString()
  @IsNotEmpty()
  description: string;
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  quantity: number;
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  amount: number;
}
export class createInvoiceDTO {
  @IsString()
  @IsNotEmpty()
  templateId: string;
  @IsString()
  @IsNotEmpty()
  date: string;
  @IsString()
  @IsNotEmpty()
  documentId: string;
  @IsString()
  @IsNotEmpty()
  amount: string;
  @IsString()
  @IsNotEmpty()
  signature: string;
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  client: client;
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => client)
  creditor: client;
  @IsArray()
  @IsDefined()
  @ValidateNested()
  @Type(() => item)
  items: item[];
}
