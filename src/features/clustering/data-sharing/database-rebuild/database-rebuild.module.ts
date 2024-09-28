import { Module } from "@nestjs/common"
import { RedisClientModuleDef } from "../../redis-communication/redis-client.module-def"
import { DatabaseModule } from "src/database/database.module"
import { DatabaseTransmitterService } from "./database-transmitter.service"
import { DatabaseRebuildController } from "./database-rebuild.controller"
import { DatabaseReceiverService } from "./database-receiver.service"
import { DatabaseRebuildManagerService } from "./database-rebuild-manager.service"
import { LeaderInitializedEventHandler } from "./leader-initialized.handler"

@Module({
    imports: [RedisClientModuleDef, DatabaseModule],
    providers: [
        DatabaseRebuildManagerService,
        DatabaseTransmitterService,
        DatabaseReceiverService,
        LeaderInitializedEventHandler,
    ],
    controllers: [DatabaseRebuildController],
    exports: [DatabaseRebuildManagerService],
})
export class DatabaseRebuildModule {}
