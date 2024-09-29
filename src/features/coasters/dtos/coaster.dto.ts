import { ApiProperty } from "@nestjs/swagger"
import { WagonDto } from "./wagon.dto"

export class CoasterDto {
    @ApiProperty({
        type: String,
        example: "A42",
        description: "Roller coaster unique identifier, always starts with 'A'",
    })
    id: string

    @ApiProperty({
        type: Number,
        example: 5,
        description: "Number of personnel that can operate the coaster",
        minimum: 0,
    })
    numberOfPersonnel: number

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
        description: "Length of the coaster track in meters",
        minimum: 0,
    })
    trackLength: number

    @ApiProperty({
        type: Number,
        example: 1.2,
        description: "Speed of single wagon on coaster in m/s",
    })
    wagonSpeed: number

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

    @ApiProperty({
        type: [WagonDto],
        example: [{ id: "W69", numberOfSeats: 42 }],
        description: "List of wagons that are running over the coaster",
    })
    wagons: WagonDto[]
}
