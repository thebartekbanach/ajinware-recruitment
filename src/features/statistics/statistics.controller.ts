import { Controller, Get, Header, Inject } from "@nestjs/common"
import { StatisticsQueryService } from "./statistics-query.service"
import {
    ApiOkResponse,
    ApiOperation,
    ApiProduces,
    ApiTags,
} from "@nestjs/swagger"
import { CoasterStatisticsDto } from "./coaster-statistics.dto"
import { StatisticsConsoleServeService } from "./statistics-console-serve.service"

@ApiTags("statistics")
@Controller("statistics")
export class StatisticsController {
    constructor(
        @Inject(StatisticsQueryService)
        private readonly statisticsQueryService: StatisticsQueryService,

        @Inject(StatisticsConsoleServeService)
        private readonly statisticsConsoleServeService: StatisticsConsoleServeService,
    ) {}

    @Get("latest")
    @ApiOperation({
        summary:
            "Returns the latest statistics of all roller coasters registered in the system",
    })
    @ApiOkResponse({
        description: "List of statistics",
        type: [CoasterStatisticsDto],
    })
    async getLatestStatistics() {
        return await this.statisticsQueryService.getAllCoastersStatistics()
    }

    @Get("console")
    @Header("Content-Type", "text/html")
    @ApiOperation({
        summary:
            "Returns the statistics console frontend for live websocket updates of statistics",
    })
    @ApiOkResponse({
        description:
            "Statistics console frontend, text/html - fetch with your browser",
        type: String,
    })
    @ApiProduces("text/html")
    async getStatisticsConsoleFrontend() {
        return this.statisticsConsoleServeService.serveStatisticsPage()
    }
}
