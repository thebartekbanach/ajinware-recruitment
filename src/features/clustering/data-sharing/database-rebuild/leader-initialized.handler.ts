import { EventsHandler } from "@nestjs/cqrs"
import { Inject, Logger } from "@nestjs/common"
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston"
import { DatabaseRebuildManagerService } from "./database-rebuild-manager.service"
import { LeaderInitializedEvent } from "../../leader-election/leader-initialized.event"
import { ClusteringConfig } from "src/config/clustering"

@EventsHandler(LeaderInitializedEvent)
export class LeaderInitializedEventHandler {
    constructor(
        @Inject(ClusteringConfig)
        private readonly clusteringConfig: ClusteringConfig,
        @Inject(DatabaseRebuildManagerService)
        private readonly databaseRebuildManager: DatabaseRebuildManagerService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
    ) {}

    handle(event: LeaderInitializedEvent) {
        if (this.clusteringConfig.node.name === event.leaderNodeName) {
            // we are first node in the cluster, we are not rebuilding the database
            // and our database is now the database, that other nodes will rebuild from
            this.logger.warn(
                "This node is first leader in the cluster, no need to rebuild database",
            )
            this.databaseRebuildManager.databaseIsThePrimaryDatabase()
            return
        }

        this.logger.warn(
            "Leader initialized, starting database rebuild process",
        )
        this.databaseRebuildManager.startRebuildProcess()
    }
}
