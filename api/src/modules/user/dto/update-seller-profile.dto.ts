import { IsOptional, IsString, Matches, MinLength, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

class DaySchedule {
  @IsString()
  @Matches(/^\d{2}:\d{2}:\d{2}Z?$/)
  start: string

  @IsString()
  @Matches(/^\d{2}:\d{2}:\d{2}Z?$/)
  end: string
}

class HoursOfOperation {
  @IsOptional()
  @ValidateNested()
  @Type(() => DaySchedule)
  monday?: DaySchedule

  @IsOptional()
  @ValidateNested()
  @Type(() => DaySchedule)
  tuesday?: DaySchedule

  @IsOptional()
  @ValidateNested()
  @Type(() => DaySchedule)
  wednesday?: DaySchedule

  @IsOptional()
  @ValidateNested()
  @Type(() => DaySchedule)
  thursday?: DaySchedule

  @IsOptional()
  @ValidateNested()
  @Type(() => DaySchedule)
  friday?: DaySchedule

  @IsOptional()
  @ValidateNested()
  @Type(() => DaySchedule)
  saturday?: DaySchedule

  @IsOptional()
  @ValidateNested()
  @Type(() => DaySchedule)
  sunday?: DaySchedule
}

export class UpdateSellerProfileDto {
  @IsString()
  @MinLength(1)
  companyName: string

  @IsString()
  @MinLength(1)
  sellerName: string

  @IsString()
  @MinLength(1)
  companyType: string

  @IsOptional()
  @IsString()
  companyDescription?: string

  @IsOptional()
  @IsString()
  address?: string

  @IsOptional()
  @ValidateNested()
  @Type(() => HoursOfOperation)
  hoursOfOperation?: HoursOfOperation | null

  @IsString()
  @Matches(/^\+[1-9]\d{0,3}\s?\d{6,14}$/)
  contactNumber: string
}
