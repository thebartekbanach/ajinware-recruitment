import {
    Body,
    Controller,
    Delete,
    Inject,
    Param,
    Post,
    Res,
} from "@nestjs/common"
import {
    ApiAcceptedResponse,
    ApiBadRequestResponse,
    ApiBody,
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiTags,
} from "@nestjs/swagger"
import { CreateWagonDto } from "./dtos/create-wagon.dto"
import { CommandBus } from "@nestjs/cqrs"
import { CreateWagonCommand } from "./wagons-creation/create-wagon.command"
import { Response } from "express"
import { DeleteWagonCommand } from "./wagons-deletion/delete-wagon.command"

@ApiTags("wagons")
@Controller("coasters/:coasterId/wagons")
@ApiParam({ name: "coasterId", description: "Roller coaster identifier" })
export class WagonsController {
    constructor(@Inject(CommandBus) private readonly commandBus: CommandBus) {}

    @Post()
    @ApiOperation({
        summary: "Adds new wagon to specified roller coaster",
    })
    @ApiBody({ type: CreateWagonDto })
    @ApiCreatedResponse({ description: "Roller coaster wagon created" })
    @ApiAcceptedResponse({
        description:
            "Roller coaster wagon created and will be synchronized among other system nodes",
    })
    @ApiBadRequestResponse({
        description: "Invalid roller coaster wagon data provided",
    })
    @ApiNotFoundResponse({
        description: "Roller coaster not found",
    })
    async createWagon(
        @Param("coasterId") coasterId: string,
        @Body() wagonToAdd: CreateWagonDto,
        @Res() response: Response,
    ): Promise<void> {
        const result = await this.commandBus.execute(
            new CreateWagonCommand({
                coasterId,
                numberOfSeats: wagonToAdd.numberOfSeats,
                wagonSpeed: wagonToAdd.wagonSpeed,
            }),
        )

        if (result === "COASTER_NOT_FOUND") {
            response.status(404).send("Coaster not found")
            return
        }

        response.status(201).send("Wagon created")
    }

    @Delete("/:wagonId")
    @ApiOperation({
        summary: "Removes selected wagon from the roller coaster",
    })
    @ApiParam({ name: "wagonId", description: "Identifier of wagon" })
    @ApiOkResponse({
        description: "Selected wagon has been removed from the roller coaster",
    })
    @ApiAcceptedResponse({
        description:
            "Selected wagon has been removed from the roller coaster and change will be synchronized among other system nodes",
    })
    @ApiNotFoundResponse({
        description: "Roller coaster or wagon not found",
    })
    async deleteWagon(
        @Param("coasterId") coasterId: string,
        @Param("wagonId") wagonId: string,
        @Res() response: Response,
    ): Promise<void> {
        const result = await this.commandBus.execute(
            new DeleteWagonCommand({
                coasterId,
                wagonId,
            }),
        )

        if (result === "COASTER_NOT_FOUND") {
            response.status(404).send("Coaster not found")
            return
        }

        if (result === "WAGON_NOT_FOUND") {
            response.status(404).send("Wagon not found")
            return
        }

        response.status(200).send("Wagon deleted")
    }
}
