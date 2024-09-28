import { Inject, Injectable, Logger } from "@nestjs/common"
import { CoasterUpdatedEvent } from "./coaster-updated.event"
import { ClusteringConfig } from "src/config/clustering"
import { EventBus } from "@nestjs/cqrs"
import { REDIS_CLIENT_PROXY } from "../../redis-communication/di.constants"
import { ClientProxy } from "@nestjs/microservices"
import { DATABASE_SYNC_TOPIC } from "./constants"
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston"

@Injectable()
export class DatabaseSyncService {
    constructor(
        @Inject(ClusteringConfig)
        private readonly clusteringConfig: ClusteringConfig,
        @Inject(EventBus) private readonly eventBus: EventBus,
        @Inject(REDIS_CLIENT_PROXY) private readonly redisClient: ClientProxy,
        @Inject(WINSTON_MODULE_NEST_PROVIDER)
        private readonly logger: Logger,
    ) {}

    emitCoasterUpdatedEventToOtherNodes(event: CoasterUpdatedEvent) {
        // prevent infinite loops
        if (event.emitterNodeName !== this.clusteringConfig.node.name) {
            return
        }

        const json = event.toJSON()

        this.redisClient.emit(DATABASE_SYNC_TOPIC, json)

        this.logger.log(
            `Emitted coaster ${event.coaster.id} updated event to other nodes`,
        )
    }

    emitCoasterUpdatedEventToThisNode(event: CoasterUpdatedEvent) {
        // prevent infinite loops
        if (event.emitterNodeName === this.clusteringConfig.node.name) {
            return
        }

        this.eventBus.publish(event)
    }
}
