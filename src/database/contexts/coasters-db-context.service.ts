import { Inject, Injectable } from "@nestjs/common"
import { CoasterEntity } from "../entities/coaster.entity"
import { DbConfig } from "src/config/db"
import { CachedJsonFileDbContextService } from "../../common/database/cached-json-file-db-context.service"

@Injectable()
export class CoastersDbContext extends CachedJsonFileDbContextService<CoasterEntity> {
    constructor(@Inject(DbConfig) dbConfig: DbConfig) {
        super(dbConfig.coastersDatabasePath)
    }
}
