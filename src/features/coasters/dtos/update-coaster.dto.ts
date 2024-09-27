import { ApiPropertyOptional } from "@nestjs/swagger"
import { IsNumber, IsOptional, IsPositive } from "class-validator"
import { IsTimeString } from "src/common/validators/is-time.validator"

export class UpdateCoasterDto {
    @IsOptional()
    @IsNumber()
    @IsPositive()
    @ApiPropertyOptional({
        type: Number,
        example: 5,
        description: "Number of personnel that can operate the coaster",
        minimum: 0,
    })
    numberOfPersonnel?: number

    @IsOptional()
    @IsNumber()
    @IsPositive()
    @ApiPropertyOptional({
        type: Number,
        example: 600,
        description: "Number of clients that will ride the coaster daily",
        minimum: 0,
    })
    numberOfClientsDaily?: number

    @IsOptional()
    @IsTimeString()
    @ApiPropertyOptional({
        type: String,
        example: "09:00",
        description: "Hour when the coaster track opens",
    })
    openHour?: string

    @IsOptional()
    @IsTimeString()
    @ApiPropertyOptional({
        type: String,
        example: "20:00",
        description: "Hour when the coaster track closes",
    })
    closeHour?: string
}
