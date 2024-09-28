import { Inject, Injectable } from "@nestjs/common"
import { ClientProxy } from "@nestjs/microservices"
import { CoastersRepository } from "src/database/coasters.repository"
import { REDIS_CLIENT_PROXY } from "../../redis-communication/di.constants"
import {
    createDatabaseRebuildTopic,
    DATABASE_REBUILD_DONE_MESSAGE,
} from "./constants"
import { CoasterUpdatedEvent } from "../database-sync/coaster-updated.event"
import { ClusteringConfig } from "src/config/clustering"
import { CurrentLeaderService } from "../../leader-election/current-leader.service"

@Injectable()
export class DatabaseTransmitterService {
    constructor(
        @Inject(ClusteringConfig)
        private readonly clusteringConfig: ClusteringConfig,

        @Inject(CurrentLeaderService)
        private readonly currentLeaderService: CurrentLeaderService,

        @Inject(CoastersRepository)
        private readonly coastersRepository: CoastersRepository,

        @Inject(REDIS_CLIENT_PROXY) private readonly redisClient: ClientProxy,
    ) {}

    async startTransmissionToNode(targetNodeName: string) {
        if (!this.currentLeaderService.clusteringModeActive) {
            return
        }

        if (!this.currentLeaderService.isLeaderElected) {
            return
        }

        if (!this.currentLeaderService.isCurrentNodeLeader) {
            return
        }

        await this.transmitData(targetNodeName)
    }

    private async transmitData(targetNodeName: string) {
        const coasters = await this.coastersRepository.findAll()

        const targetNodeRebuildTopic =
            createDatabaseRebuildTopic(targetNodeName)

        for (const coaster of coasters) {
            const event = new CoasterUpdatedEvent(
                coaster,
                this.clusteringConfig.node.name,
            )

            await this.transmitSingleCoaster(
                targetNodeRebuildTopic,
                event.toJSON(),
            )
        }

        this.redisClient.emit(
            targetNodeRebuildTopic,
            DATABASE_REBUILD_DONE_MESSAGE,
        )
    }

    private async transmitSingleCoaster(
        targetNodeRebuildTopic: string,
        coasterJson: string,
    ) {
        // break the blocking loop to let the node process another requests while synchronizing
        return new Promise<void>((resolve) => {
            this.redisClient.emit(targetNodeRebuildTopic, coasterJson)
            setImmediate(resolve)
        })
    }
}
