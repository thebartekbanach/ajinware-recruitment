import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Inject,
    Param,
    Post,
    Put,
    Res,
} from "@nestjs/common"
import { Response } from "express"
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
import { CreateCoasterDto } from "./dtos/create-coaster.dto"
import { CommandBus } from "@nestjs/cqrs"
import { CreateCoasterCommand } from "./coaster-creation/create-coaster.command"
import { UpdateCoasterDto } from "./dtos/update-coaster.dto"
import { ModifyCoasterCommand } from "./coaster-modification/modify-coaster.command"

@ApiTags("coasters")
@Controller("coasters")
export class CoastersController {
    constructor(@Inject(CommandBus) private readonly commandBus: CommandBus) {}

    @Post()
    @ApiOperation({
        summary: "Adds new roller coaster to the system",
    })
    @ApiBody({ type: CreateCoasterDto })
    @ApiCreatedResponse({ description: "Roller coaster created" })
    @ApiAcceptedResponse({
        description:
            "Roller coaster created and will be synchronized among other system nodes",
    })
    @ApiBadRequestResponse({
        description: "Invalid roller coaster data provided",
    })
    @HttpCode(HttpStatus.CREATED) // TODO: return accepted in case of multiple nodes
    async createCoaster(@Body() coaster: CreateCoasterDto): Promise<string> {
        const createdCoasterId = await this.commandBus.execute(
            new CreateCoasterCommand(coaster),
        )

        return createdCoasterId
    }

    @Put("/:coasterId")
    @ApiOperation({
        summary: "Updates roller coaster in the system",
    })
    @ApiBody({
        type: UpdateCoasterDto,
        description:
            "Roller coaster data to update, provide one or more fields to update, every field is optional",
    })
    @ApiParam({
        name: "coasterId",
        required: true,
        description: "Unique identifier of the roller coaster to modify",
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
    async updateCoaster(
        @Param("coasterId") coasterId: string,
        @Body() coaster: UpdateCoasterDto,
        @Res() res: Response,
    ): Promise<void> {
        const command = new ModifyCoasterCommand({
            ...coaster,
            coasterId,
        })

        const result = await this.commandBus.execute(command)

        if (result === "COASTER_NOT_FOUND") {
            res.status(HttpStatus.NOT_FOUND).send()
            return
        }

        if (result === "NO_FIELDS_PROVIDED") {
            res.status(HttpStatus.BAD_REQUEST).send()
            return
        }

        // TODO: return accepted in case of multiple nodes

        res.status(HttpStatus.OK).send()
    }
}
