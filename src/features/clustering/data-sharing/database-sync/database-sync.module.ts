import { Module } from "@nestjs/common"
import { DatabaseSyncService } from "./database-sync.service"
import { CoasterUpdatedHandler } from "./coaster-updated.handler"
import { DatabaseSyncController } from "./database-sync.controller"
import { DatabaseModule } from "src/database/database.module"
import { RedisClientModuleDef } from "../../redis-communication/redis-client.module-def"

@Module({
    imports: [DatabaseModule, RedisClientModuleDef],
    providers: [DatabaseSyncService, CoasterUpdatedHandler],
    controllers: [DatabaseSyncController],
})
export class DatabaseSyncModule {}
