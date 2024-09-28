import { Inject, Injectable } from "@nestjs/common"
import { REDIS_CLIENT_PROXY } from "../../redis-communication/di.constants"
import { ClientProxy } from "@nestjs/microservices"
import { ClusteringConfig } from "src/config/clustering"
import { DATABASE_REBUILD_REQUEST_TOPIC } from "./constants"
import { CoastersRepository } from "src/database/coasters.repository"

@Injectable()
export class DatabaseRebuildManagerService {
    private static status:
        | "synchronized"
        | "rebuilding"
        | "waiting-for-leader-info" = "waiting-for-leader-info"

    get databaseInitialSynchronizationStatus() {
        return DatabaseRebuildManagerService.status
    }

    constructor(
        @Inject(ClusteringConfig)
        private readonly clusteringConfig: ClusteringConfig,
        @Inject(REDIS_CLIENT_PROXY) private readonly redisClient: ClientProxy,
        @Inject(CoastersRepository)
        private readonly coastersRepository: CoastersRepository,
    ) {}

    databaseIsThePrimaryDatabase() {
        DatabaseRebuildManagerService.status = "synchronized"
    }

    async startRebuildProcess() {
        DatabaseRebuildManagerService.status = "rebuilding"
        await this.coastersRepository.dropDatabase()
        this.redisClient.emit(
            DATABASE_REBUILD_REQUEST_TOPIC,
            this.clusteringConfig.node.name,
        )
    }

    receivedSynchronizationDoneMessage() {
        DatabaseRebuildManagerService.status = "synchronized"
    }
}
