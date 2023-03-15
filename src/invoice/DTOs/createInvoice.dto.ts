import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class createInvoiceDTO {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  phone: number;
}
