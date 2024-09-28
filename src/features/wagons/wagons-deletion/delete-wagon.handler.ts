import { CommandHandler, EventBus, IInferredCommandHandler } from "@nestjs/cqrs"
import {
    DeleteWagonCommand,
    DeleteWagonCommandResult,
} from "./delete-wagon.command"
import { Inject } from "@nestjs/common"
import { WagonsRepository } from "src/database/wagons.repository"
import { CoastersRepository } from "src/database/coasters.repository"
import { ClusteringConfig } from "src/config/clustering"
import { CoasterUpdatedEvent } from "src/features/clustering/data-sharing/database-sync/coaster-updated.event"

@CommandHandler(DeleteWagonCommand)
export class DeleteWagonCommandHandler
    implements IInferredCommandHandler<DeleteWagonCommand>
{
    constructor(
        @Inject(WagonsRepository)
        private readonly coasterWagons: WagonsRepository,

        @Inject(CoastersRepository)
        private readonly coasters: CoastersRepository,

        @Inject(ClusteringConfig)
        private readonly clusteringConfig: ClusteringConfig,

        @Inject(EventBus) private readonly eventBus: EventBus,
    ) {}

    async execute(
        command: DeleteWagonCommand,
    ): Promise<DeleteWagonCommandResult> {
        const error = await this.coasterWagons.removeWagon({
            coasterId: command.coasterId,
            wagonId: command.wagonId,
        })

        if (error != null) {
            return error
        }

        const updatedCoaster = await this.coasters.findById(command.coasterId)
        if (!updatedCoaster) {
            // will never happen, make typescript happy
            throw new Error("Coaster not found, but wagon was added")
        }

        this.eventBus.publish(
            new CoasterUpdatedEvent(
                updatedCoaster,
                this.clusteringConfig.node.name,
            ),
        )

        return "OK"
    }
}
