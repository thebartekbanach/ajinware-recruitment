import { Inject, Injectable } from "@nestjs/common"
import {
    HealthCheckError,
    HealthIndicator,
    HealthIndicatorResult,
} from "@nestjs/terminus"
import { DatabaseRebuildManagerService } from "../clustering/data-sharing/database-rebuild/database-rebuild-manager.service"
import { ClusteringConfig } from "src/config/clustering"

@Injectable()
export class DatabaseHealthIndicator extends HealthIndicator {
    constructor(
        @Inject(ClusteringConfig) private readonly config: ClusteringConfig,

        @Inject(DatabaseRebuildManagerService)
        private readonly databaseRebuildManagerService: DatabaseRebuildManagerService,
    ) {
        super()
    }

    async isSynchronized(): Promise<HealthIndicatorResult> {
        if (this.config.offlineMode) {
            return this.getStatus("database-synchronization", true, {
                status: "node is running in offline mode",
            })
        }

        const status =
            this.databaseRebuildManagerService
                .databaseInitialSynchronizationStatus

        const isHealthy = status === "synchronized"
        const result = this.getStatus("database-synchronization", isHealthy, {
            initialSynchronizationStatus: status,
        })

        if (isHealthy) {
            return result
        }

        throw new HealthCheckError("Database is not synchronized yet", result)
    }
}
