import { ApiProperty } from "@nestjs/swagger"

export class WagonDto {
    @ApiProperty({
        type: String,
        example: "W69",
        description:
            "Wagon unique identifier, always starts with 'W', unique per coaster",
    })
    id: string

    @ApiProperty({
        type: Number,
        example: 42,
        description: "Number of seats in the wagon",
        minimum: 1,
    })
    numberOfSeats: number

    @ApiProperty({
        type: Number,
        example: 20,
        description: "Speed of the wagon in m/s",
        minimum: 1,
    })
    wagonSpeed: number
}