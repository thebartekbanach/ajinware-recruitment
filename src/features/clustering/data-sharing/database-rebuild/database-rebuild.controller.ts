import { Controller, Inject } from "@nestjs/common"
import { MessagePattern, Payload } from "@nestjs/microservices"
import {
    DATABASE_REBUILD_CURRENT_NODE_TOPIC,
    DATABASE_REBUILD_REQUEST_TOPIC,
} from "./constants"
import { DatabaseTransmitterService } from "./database-transmitter.service"
import { DatabaseReceiverService } from "./database-receiver.service"

@Controller()
export class DatabaseRebuildController {
    constructor(
        @Inject(DatabaseReceiverService)
        private readonly databaseReceiverService: DatabaseReceiverService,
        @Inject(DatabaseTransmitterService)
        private readonly databaseTransmitterService: DatabaseTransmitterService,
    ) {}

    @MessagePattern(DATABASE_REBUILD_CURRENT_NODE_TOPIC)
    async receiveSingleCoasterTransmission(
        @Payload()
        packet: string,
    ) {
        await this.databaseReceiverService.parseDatabaseRebuildPacket(packet)
    }

    @MessagePattern(DATABASE_REBUILD_REQUEST_TOPIC)
    async handleDatabaseRebuildRequest(@Payload() requesteeNodeName: string) {
        await this.databaseTransmitterService.startTransmissionToNode(
            requesteeNodeName,
        )
    }
}
