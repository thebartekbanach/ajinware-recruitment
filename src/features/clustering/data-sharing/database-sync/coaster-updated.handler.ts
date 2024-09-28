import { EventsHandler } from "@nestjs/cqrs"
import { CoasterUpdatedEvent } from "./coaster-updated.event"
import { Inject, Logger } from "@nestjs/common"
import { DatabaseSyncService } from "./database-sync.service"
import { ClusteringConfig } from "src/config/clustering"
import { CoastersRepository } from "src/database/coasters.repository"
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston"

@EventsHandler(CoasterUpdatedEvent)
export class CoasterUpdatedHandler {
    constructor(
        @Inject(DatabaseSyncService)
        private readonly databaseSyncService: DatabaseSyncService,

        @Inject(ClusteringConfig)
        private readonly clusteringConfig: ClusteringConfig,

        @Inject(CoastersRepository)
        private readonly coastersRepository: CoastersRepository,

        @Inject(WINSTON_MODULE_NEST_PROVIDER)
        private readonly logger: Logger,
    ) {}

    handle(event: CoasterUpdatedEvent) {
        if (this.clusteringConfig.offlineMode) {
            return
        }

        this.databaseSyncService.emitCoasterUpdatedEventToOtherNodes(event)

        if (event.emitterNodeName === this.clusteringConfig.node.name) {
            // if this node emitted the event, we don't need to do anything
            // as the database is already up to date
            return
        }

        this.logger.log(
            `Syncing coaster ${event.coaster.id} received from node ${event.emitterNodeName}`,
        )

        this.coastersRepository.createOrUpdate(event.coaster)
    }
}
