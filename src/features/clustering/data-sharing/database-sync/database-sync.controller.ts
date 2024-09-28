import { Controller, Inject } from "@nestjs/common"
import { DatabaseSyncService } from "./database-sync.service"
import { MessagePattern, Payload } from "@nestjs/microservices"
import { CoasterUpdatedEvent } from "./coaster-updated.event"
import { DATABASE_SYNC_TOPIC } from "./constants"

@Controller()
export class DatabaseSyncController {
    constructor(
        @Inject(DatabaseSyncService)
        private readonly databaseSyncService: DatabaseSyncService,
    ) {}

    @MessagePattern(DATABASE_SYNC_TOPIC)
    async coasterUpdated(
        @Payload({
            transform: CoasterUpdatedEvent.fromJSON,
        })
        event: CoasterUpdatedEvent,
    ) {
        this.databaseSyncService.emitCoasterUpdatedEventToThisNode(event)
    }
}
