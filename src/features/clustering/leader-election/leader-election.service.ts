import { Inject, Injectable } from "@nestjs/common"
import { ClusteringConfig } from "src/config/clustering"
import { RedlockService } from "@anchan828/nest-redlock"
import { Lock } from "redlock"
import { EventBus } from "@nestjs/cqrs"
import { ClientProxy } from "@nestjs/microservices"
import { REDIS_CLIENT_PROXY } from "../redis-communication/di.constants"
import { LeaderChangedEvent } from "./leader-changed.event"
import { CLUSTER_LEADER_CHANGED_TOPIC } from "./constants"

@Injectable()
export class LeaderElectionService {
    private leaderLock: Lock | null = null
    private tryingToWinElection = false

    constructor(
        @Inject(ClusteringConfig)
        private readonly clusteringConfig: ClusteringConfig,
        @Inject(RedlockService) private readonly redlock: RedlockService,
        @Inject(REDIS_CLIENT_PROXY) private readonly redisClient: ClientProxy,
        @Inject(EventBus) private readonly eventBus: EventBus,
    ) {}

    async tryToWinElection() {
        if (this.clusteringConfig.offlineMode) {
            return
        }

        if (this.tryingToWinElection) {
            return
        }

        if (this.leaderLock) {
            await this.extendLeaderLock()
            return
        }

        await this.tryToWinElectionSafely()
    }

    private async tryToWinElectionSafely() {
        this.tryingToWinElection = true
        try {
            this.leaderLock = await this.redlock.acquire(["leading-node"], 2000)

            const event = new LeaderChangedEvent(
                this.clusteringConfig.node.name,
                this.clusteringConfig.node.baseUrl,
            )

            this.eventBus.publish(event)
            this.redisClient.emit(CLUSTER_LEADER_CHANGED_TOPIC, event.toJSON())
        } catch (error) {
            if (
                error.message ===
                "The operation was unable to achieve a quorum during its retry window."
            ) {
                return
            }

            throw error
        } finally {
            this.tryingToWinElection = false
        }
    }

    private async extendLeaderLock() {
        if (!this.leaderLock) {
            return
        }

        if (this.leaderLock.expiration < Date.now()) {
            this.leaderLock = null
            return
        }

        this.leaderLock = await this.leaderLock.extend(2000)
    }
}
