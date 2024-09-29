import { Module } from "@nestjs/common"
import { StatisticsGateway } from "./statistics.gateway"
import { CoasterStatisticsService } from "./coaster-statistics.service"
import { StatisticsQueryService } from "./statistics-query.service"
import { StatisticsController } from "./statistics.controller"
import { DatabaseModule } from "src/database/database.module"
import { StatisticsConsoleServeService } from "./statistics-console-serve.service"

@Module({
    imports: [DatabaseModule],
    providers: [
        CoasterStatisticsService,
        StatisticsQueryService,
        StatisticsGateway,
        StatisticsConsoleServeService,
    ],
    controllers: [StatisticsController],
})
export class StatisticsModule {}
