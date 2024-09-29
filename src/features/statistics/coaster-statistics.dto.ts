import { ApiProperty } from "@nestjs/swagger"

export class CoasterStatisticsDto {
    @ApiProperty({
        type: String,
        example: "A42",
        description: "Roller coaster unique identifier, always starts with 'A'",
    })
    id: string

    @ApiProperty({
        type: Number,
        example: 5,
        description:
            "Number of personnel that is available to operate the coaster",
        minimum: 1,
    })
    availablePersonnelNumber: number

    @ApiProperty({
        type: Number,
        example: 5,
        description: "Number of personnel that can operate the coaster",
        minimum: 0,
    })
    expectedPersonnelNumber: number

    @ApiProperty({
        type: Number,
        example: 5,
        description: "Number of available wagons",
        minimum: 0,
    })
    availableWagonsNumber: number

    @ApiProperty({
        type: Number,
        example: 600,
        description: "Number of clients that will ride the coaster daily",
        minimum: 0,
    })
    numberOfClientsDaily: number

    @ApiProperty({
        type: Number,
        example: 1200,
        description: "Number of clients that coaster can serve daily",
        minimum: 0,
    })
    numberOfClientsCanBeServedDaily: number

    @ApiProperty({
        type: String,
        example: "09:00",
        description: "Hour when the coaster track opens",
    })
    openHour: string

    @ApiProperty({
        type: String,
        example: "20:00",
        description: "Hour when the coaster track closes",
    })
    closeHour: string
}
