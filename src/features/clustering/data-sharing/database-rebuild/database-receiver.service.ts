import { Inject, Injectable, Logger } from "@nestjs/common"
import { EventBus } from "@nestjs/cqrs"
import { DatabaseRebuildManagerService } from "./database-rebuild-manager.service"
import { CoasterUpdatedEvent } from "../database-sync/coaster-updated.event"
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston"
import { DATABASE_REBUILD_DONE_MESSAGE } from "./constants"

@Injectable()
export class DatabaseReceiverService {
    constructor(
        @Inject(EventBus) private readonly eventBus: EventBus,
        @Inject(DatabaseRebuildManagerService)
        private readonly databaseRebuildManager: DatabaseRebuildManagerService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
    ) {}

    async parseDatabaseRebuildPacket(packet: string) {
        if (packet === DATABASE_REBUILD_DONE_MESSAGE) {
            this.logger.warn("Database rebuild complete")
            this.databaseRebuildManager.receivedSynchronizationDoneMessage()
            return
        }

        this.eventBus.publish(CoasterUpdatedEvent.fromJSON(packet))
    }
}
