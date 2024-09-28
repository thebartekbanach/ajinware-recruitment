import { Controller, Inject } from "@nestjs/common"
import { Cron } from "@nestjs/schedule"
import { LeaderElectionService } from "./leader-election.service"
import { MessagePattern, Payload } from "@nestjs/microservices"
import { LeaderChangedEvent } from "./leader-changed.event"
import { CLUSTER_LEADER_CHANGED_TOPIC } from "./constants"
import { EventBus } from "@nestjs/cqrs"

@Controller()
export class LeaderElectionController {
    constructor(
        @Inject(LeaderElectionService)
        private readonly masterNodeService: LeaderElectionService,

        @Inject(EventBus)
        private readonly eventBus: EventBus,
    ) {}

    @Cron("* * * * * *") // every two seconds
    async handleCron() {
        await this.masterNodeService.tryToWinElection()
    }

    @MessagePattern(CLUSTER_LEADER_CHANGED_TOPIC)
    async leaderChanged(
        @Payload({ transform: LeaderChangedEvent.fromJSON })
        event: LeaderChangedEvent,
    ) {
        this.eventBus.publish(event)
    }
}
