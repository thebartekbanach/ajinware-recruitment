import { CommandHandler, EventBus, IInferredCommandHandler } from "@nestjs/cqrs"
import {
    CreateWagonCommand,
    CreateWagonCommandResult,
} from "./create-wagon.command"
import { Inject } from "@nestjs/common"
import { WagonsRepository } from "src/database/wagons.repository"
import { ClusteringConfig } from "src/config/clustering"
import { CoastersRepository } from "src/database/coasters.repository"
import { CoasterUpdatedEvent } from "src/features/clustering/data-sharing/database-sync/coaster-updated.event"

@CommandHandler(CreateWagonCommand)
export class CreateWagonCommandHandler
    implements IInferredCommandHandler<CreateWagonCommand>
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
        command: CreateWagonCommand,
    ): Promise<CreateWagonCommandResult> {
        const wagonAdded = await this.coasterWagons.addWagon({
            coasterId: command.coasterId,
            numberOfSeats: command.numberOfSeats,
            wagonSpeed: command.wagonSpeed,
        })

        if (!wagonAdded) {
            return "COASTER_NOT_FOUND"
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
