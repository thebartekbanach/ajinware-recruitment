import { EventsHandler } from "@nestjs/cqrs"
import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets"
import type { Server } from "ws"
import { CoasterUpdatedEvent } from "../clustering/data-sharing/database-sync/coaster-updated.event"
import { Inject } from "@nestjs/common"
import { CoasterStatisticsService } from "./coaster-statistics.service"

@WebSocketGateway({
    path: "/statistics/live",
    cors: {
        origin: "*",
    },
})
@EventsHandler(CoasterUpdatedEvent)
export class StatisticsGateway {
    constructor(
        @Inject(CoasterStatisticsService)
        private readonly coasterStatisticsService: CoasterStatisticsService,
    ) {}

    @WebSocketServer()
    server: Server

    handle(event: CoasterUpdatedEvent) {
        const statisticsEvent =
            this.coasterStatisticsService.convertCoasterToCoasterStatistics(
                event.coaster,
            )

        const statisticsJson = JSON.stringify(statisticsEvent)

        this.server.clients.forEach((client) => {
            client.send(statisticsJson)
        })
    }
}
