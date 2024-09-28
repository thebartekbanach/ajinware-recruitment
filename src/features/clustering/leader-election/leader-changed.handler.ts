import { EventsHandler } from "@nestjs/cqrs"
import { LeaderChangedEvent } from "./leader-changed.event"
import { Inject, Logger } from "@nestjs/common"
import { CurrentLeaderManagerService } from "./current-leader.service"
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston"

@EventsHandler(LeaderChangedEvent)
export class LeaderChangedEventHandler {
    constructor(
        @Inject(CurrentLeaderManagerService)
        private readonly currentLeaderManager: CurrentLeaderManagerService,

        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
    ) {}

    handle(event: LeaderChangedEvent) {
        if (
            this.currentLeaderManager.isLeaderElected &&
            this.currentLeaderManager.currentLeaderName === event.leaderNodeName
        ) {
            return
        }

        this.logger.log(
            `Leader changed to ${event.leaderNodeName} at ${event.leaderNodePublicUrl}`,
        )

        this.currentLeaderManager.setLeaderInformation(
            event.leaderNodeName,
            event.leaderNodePublicUrl,
        )
    }
}
