import { Module } from "@nestjs/common"
import { DatabaseSyncModule } from "./database-sync/database-sync.module"

@Module({
    imports: [DatabaseSyncModule],
})
export class DataSharingModule {}
