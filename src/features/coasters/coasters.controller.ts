import {
    Body,
    Controller,
    Get,
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
    ApiServiceUnavailableResponse,
    ApiTags,
} from "@nestjs/swagger"
import { CreateCoasterDto } from "./dtos/create-coaster.dto"
import { CommandBus } from "@nestjs/cqrs"
import { CreateCoasterCommand } from "./coaster-creation/create-coaster.command"
import { UpdateCoasterDto } from "./dtos/update-coaster.dto"
import { ModifyCoasterCommand } from "./coaster-modification/modify-coaster.command"
import { CoastersListingService } from "./coasters-listing.service"
import { CoasterDto } from "./dtos/coaster.dto"
import { RedirectToLeader } from "../clustering/leader-election/redirect-to-leader.interceptor"
import { CurrentLeaderService } from "../clustering/leader-election/current-leader.service"

@ApiTags("coasters")
@Controller("coasters")
export class CoastersController {
    constructor(
        @Inject(CommandBus) private readonly commandBus: CommandBus,
        @Inject(CoastersListingService)
        private readonly coastersListingService: CoastersListingService,
        @Inject(CurrentLeaderService)
        private readonly currentLeaderService: CurrentLeaderService,
    ) {}

    @Get()
    @ApiOperation({
        summary:
            "Returns all roller coasters registered in the system among with their wagons",
    })
    @ApiOkResponse({
        description: "List of roller coasters",
        type: [CoasterDto],
    })
    async getAllCoasters(): Promise<CoasterDto[]> {
        return await this.coastersListingService.getAllCoasters()
    }

    @Post()
    @RedirectToLeader()
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
    @ApiServiceUnavailableResponse({
        description: "The leader has not been elected yet",
    })
    @HttpCode(HttpStatus.CREATED)
    async createCoaster(
        @Body() coaster: CreateCoasterDto,
        @Res() response: Response,
    ): Promise<void> {
        const createdCoasterId = await this.commandBus.execute(
            new CreateCoasterCommand(coaster),
        )

        if (this.currentLeaderService.clusteringModeActive) {
            response.status(HttpStatus.ACCEPTED).send(createdCoasterId)
            return
        }

        response.status(HttpStatus.CREATED).send(createdCoasterId)
    }

    @Put("/:coasterId")
    @RedirectToLeader()
    @ApiOperation({
        summary: "Updates roller coaster in the system",
    })
    @ApiBody({
        type: UpdateCoasterDto,
        description: "Roller coaster data to update",
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
    @ApiServiceUnavailableResponse({
        description: "The leader has not been elected yet",
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

        if (this.currentLeaderService.clusteringModeActive) {
            res.status(HttpStatus.ACCEPTED).send()
            return
        }

        res.status(HttpStatus.OK).send()
    }
}
