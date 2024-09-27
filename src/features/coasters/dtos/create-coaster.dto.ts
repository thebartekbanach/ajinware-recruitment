import { ApiProperty } from "@nestjs/swagger"
import { IsNumber, IsPositive } from "class-validator"
import { IsTimeString } from "src/common/validators/is-time.validator"

export class CreateCoasterDto {
    @IsNumber()
    @IsPositive()
    @ApiProperty({
        type: Number,
        example: 5,
        description: "Number of personnel that can operate the coaster",
        minimum: 0,
    })
    numberOfPersonnel: number

    @IsNumber()
    @IsPositive()
    @ApiProperty({
        type: Number,
        example: 600,
        description: "Number of clients that will ride the coaster daily",
        minimum: 0,
    })
    numberOfClientsDaily: number

    @IsNumber()
    @IsPositive()
    @ApiProperty({
        type: Number,
        example: 500,
        description: "Length of the coaster track in meters",
        minimum: 1,
    })
    trackLength: number

    @IsTimeString()
    @ApiProperty({
        type: String,
        example: "09:00",
        description: "Hour when the coaster track opens",
    })
    openHour: string

    @IsTimeString()
    @ApiProperty({
        type: String,
        example: "20:00",
        description: "Hour when the coaster track closes",
    })
    closeHour: string
}
