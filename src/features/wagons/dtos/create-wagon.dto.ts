import { ApiProperty } from "@nestjs/swagger"
import { IsNumber, IsPositive } from "class-validator"

export class CreateWagonDto {
    @IsNumber()
    @IsPositive()
    @ApiProperty({
        type: Number,
        example: 32,
        description: "Number of seats in the wagon",
        minimum: 1,
    })
    numberOfSeats: number

    @IsNumber()
    @IsPositive()
    @ApiProperty({
        type: Number,
        example: 1.2,
        description: "Speed of wagon in m/s",
    })
    wagonSpeed: number
}
