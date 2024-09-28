import { Module } from "@nestjs/common"
import { DatabaseSyncModule } from "./database-sync/database-sync.module"
import { DatabaseRebuildModule } from "./database-rebuild/database-rebuild.module"

@Module({
    imports: [DatabaseSyncModule, DatabaseRebuildModule],
})
export class DataSharingModule {}
