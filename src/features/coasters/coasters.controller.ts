import { Controller, Post, Put } from "@nestjs/common"
import {
    ApiAcceptedResponse,
    ApiBadRequestResponse,
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from "@nestjs/swagger"

@ApiTags("coasters")
@Controller("coasters")
export class CoastersController {
    @Post()
    @ApiOperation({
        summary: "Adds new roller coaster to the system",
    })
    @ApiCreatedResponse({ description: "Roller coaster created" })
    @ApiAcceptedResponse({
        description:
            "Roller coaster created and will be synchronized among other system nodes",
    })
    @ApiBadRequestResponse({
        description: "Invalid roller coaster data provided",
    })
    createCoaster(): string {
        throw new Error("Not implemented")
    }

    @Put("/:coasterId")
    @ApiOperation({
        summary: "Updates roller coaster in the system",
    })
    @ApiOkResponse({
        description: "Roller coaster updated",
    })
    @ApiAcceptedResponse({
        description:
            "Roller coaster updated and change will be synchronized among other system nodes",
    })
    @ApiNotFoundResponse({
        description: "Roller coaster not found",
    })
    @ApiBadRequestResponse({
        description: "Invalid roller coaster data provided",
    })
    updateCoaster(): string {
        throw new Error("Not implemented")
    }
}
