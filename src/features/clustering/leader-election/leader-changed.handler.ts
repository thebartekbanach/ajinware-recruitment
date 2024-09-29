import { EventBus, EventsHandler } from "@nestjs/cqrs"
import { LeaderChangedEvent } from "./leader-changed.event"
import { Inject, Logger } from "@nestjs/common"
import { CurrentLeaderManagerService } from "./current-leader.service"
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston"
import { LeaderInitializedEvent } from "./leader-initialized.event"

@EventsHandler(LeaderChangedEvent)
export class LeaderChangedEventHandler {
    constructor(
        @Inject(CurrentLeaderManagerService)
        private readonly currentLeaderManager: CurrentLeaderManagerService,

        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,

        @Inject(EventBus) private readonly eventBus: EventBus,
    ) {}

    handle(event: LeaderChangedEvent) {
        if (
            this.currentLeaderManager.isLeaderElected &&
            this.currentLeaderManager.currentLeaderName === event.leaderNodeName
        ) {
            return
        }

        if (!this.currentLeaderManager.isLeaderElected) {
            this.logger.warn(
                `Initial leader elected: ${event.leaderNodeName} at ${event.leaderNodePublicUrl}`,
            )

            this.eventBus.publish(
                new LeaderInitializedEvent(
                    event.leaderNodeName,
                    event.leaderNodePublicUrl,
                ),
            )
        }

        this.logger.warn(
            `Leader changed to ${event.leaderNodeName} at ${event.leaderNodePublicUrl}`,
        )

        this.currentLeaderManager.setLeaderInformation(
            event.leaderNodeName,
            event.leaderNodePublicUrl,
        )
    }
}
