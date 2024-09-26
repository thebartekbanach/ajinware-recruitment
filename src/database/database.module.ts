import { Module } from "@nestjs/common"
import { CoastersDbContext } from "./contexts/coasters-db-context.service"
import { CoastersRepository } from "./coasters.repository"
import { WagonsRepository } from "./wagons.repository"

const contexts = [CoastersDbContext]

const repositories = [CoastersRepository, WagonsRepository]

@Module({
    providers: [...contexts, ...repositories],
    exports: repositories,
})
export class DatabaseModule {}
