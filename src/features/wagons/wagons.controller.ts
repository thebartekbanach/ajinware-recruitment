import { Controller, Delete, Post } from "@nestjs/common"
import {
    ApiAcceptedResponse,
    ApiBadRequestResponse,
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from "@nestjs/swagger"

@ApiTags("wagons")
@Controller("coasters/:coasterId/wagons")
export class WagonsController {
    @Post()
    @ApiOperation({
        summary: "Adds new wagon to specified roller coaster",
    })
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
    createCoaster(): string {
        throw new Error("Not implemented")
    }

    @Delete("/:wagonId")
    @ApiOperation({
        summary: "Removes selected wagon from the roller coaster",
    })
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
    updateCoaster(): string {
        throw new Error("Not implemented")
    }
}
