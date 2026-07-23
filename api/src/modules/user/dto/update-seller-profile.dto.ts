import { IsOptional, IsString, Matches, MinLength, ValidateNested } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'

class DaySchedule {
  @ApiProperty({ example: '08:00:00', description: 'HH:MM:SS' })
  @IsString()
  @Matches(/^\d{2}:\d{2}:\d{2}Z?$/)
  start: string

  @ApiProperty({ example: '18:00:00', description: 'HH:MM:SS' })
  @IsString()
  @Matches(/^\d{2}:\d{2}:\d{2}Z?$/)
  end: string
}

class HoursOfOperation {
  @ApiPropertyOptional({ type: DaySchedule })
  @IsOptional()
  @ValidateNested()
  @Type(() => DaySchedule)
  monday?: DaySchedule

  @ApiPropertyOptional({ type: DaySchedule })
  @IsOptional()
  @ValidateNested()
  @Type(() => DaySchedule)
  tuesday?: DaySchedule

  @ApiPropertyOptional({ type: DaySchedule })
  @IsOptional()
  @ValidateNested()
  @Type(() => DaySchedule)
  wednesday?: DaySchedule

  @ApiPropertyOptional({ type: DaySchedule })
  @IsOptional()
  @ValidateNested()
  @Type(() => DaySchedule)
  thursday?: DaySchedule

  @ApiPropertyOptional({ type: DaySchedule })
  @IsOptional()
  @ValidateNested()
  @Type(() => DaySchedule)
  friday?: DaySchedule

  @ApiPropertyOptional({ type: DaySchedule })
  @IsOptional()
  @ValidateNested()
  @Type(() => DaySchedule)
  saturday?: DaySchedule

  @ApiPropertyOptional({ type: DaySchedule })
  @IsOptional()
  @ValidateNested()
  @Type(() => DaySchedule)
  sunday?: DaySchedule
}

export class UpdateSellerProfileDto {
  @ApiProperty({ example: 'Mi Tienda C.A.' })
  @IsString()
  @MinLength(1)
  companyName: string

  @ApiProperty({ example: 'Juan' })
  @IsString()
  @MinLength(1)
  sellerName: string

  @ApiProperty({ example: 'Pérez' })
  @IsString()
  @MinLength(1)
  sellerLastName: string

  @ApiProperty({ example: 'Retail', description: 'Type or category of the business' })
  @IsString()
  @MinLength(1)
  companyType: string

  @ApiPropertyOptional({ example: 'Vendemos productos artesanales venezolanos.' })
  @IsOptional()
  @IsString()
  companyDescription?: string

  @ApiPropertyOptional({ example: 'Av. Principal, Local 3, Caracas' })
  @IsOptional()
  @IsString()
  address?: string

  @ApiPropertyOptional({ type: HoursOfOperation, nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => HoursOfOperation)
  hoursOfOperation?: HoursOfOperation | null

  @ApiProperty({ example: '+58 4121234567', description: 'E.164 format with optional space after country code' })
  @IsString()
  @Matches(/^\+[1-9]\d{0,3}\s?\d{6,14}$/)
  contactNumber: string
}
