import { CommandHandler, EventBus, IInferredCommandHandler } from "@nestjs/cqrs"
import { Inject } from "@nestjs/common"
import { CoastersRepository } from "src/database/coasters.repository"
import {
    ModifyCoasterCommand,
    ModifyCoasterCommandResult,
} from "./modify-coaster.command"
import { ClusteringConfig } from "src/config/clustering"
import { CoasterUpdatedEvent } from "src/features/clustering/data-sharing/database-sync/coaster-updated.event"

@CommandHandler(ModifyCoasterCommand)
export class ModifyCoasterCommandHandler
    implements IInferredCommandHandler<ModifyCoasterCommand>
{
    constructor(
        @Inject(CoastersRepository)
        private readonly coasters: CoastersRepository,

        @Inject(ClusteringConfig)
        private readonly clusteringConfig: ClusteringConfig,

        @Inject(EventBus) private readonly eventBus: EventBus,
    ) {}

    async execute(
        command: ModifyCoasterCommand,
    ): Promise<ModifyCoasterCommandResult> {
        if (
            !command.numberOfPersonnel &&
            !command.numberOfClientsDaily &&
            !command.openHour &&
            !command.closeHour
        ) {
            return "NO_FIELDS_PROVIDED"
        }

        const coaster = await this.coasters.update(command)
        if (coaster === null) {
            return "COASTER_NOT_FOUND"
        }

        this.eventBus.publish(
            new CoasterUpdatedEvent(coaster, this.clusteringConfig.node.name),
        )

        return "OK"
    }
}
