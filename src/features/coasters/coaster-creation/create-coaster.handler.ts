import { CommandHandler, EventBus, IInferredCommandHandler } from "@nestjs/cqrs"
import { CreateCoasterCommand } from "./create-coaster.command"
import { Inject } from "@nestjs/common"
import { CoastersRepository } from "src/database/coasters.repository"
import { CoasterUpdatedEvent } from "src/features/clustering/data-sharing/database-sync/coaster-updated.event"
import { ClusteringConfig } from "src/config/clustering"

@CommandHandler(CreateCoasterCommand)
export class CreateCoasterCommandHandler
    implements IInferredCommandHandler<CreateCoasterCommand>
{
    constructor(
        @Inject(CoastersRepository)
        private readonly coasters: CoastersRepository,

        @Inject(ClusteringConfig)
        private readonly clusteringConfig: ClusteringConfig,

        @Inject(EventBus) private readonly eventBus: EventBus,
    ) {}

    async execute(command: CreateCoasterCommand): Promise<string> {
        const coaster = await this.coasters.create(command)

        this.eventBus.publish(
            new CoasterUpdatedEvent(coaster, this.clusteringConfig.node.name),
        )

        return coaster.id
    }
}
