import { Module } from "@nestjs/common"
import { CoastersController } from "./coasters.controller"
import { CreateCoasterInDbCommandHandler } from "./coaster-creation/create-coaster-in-db.handler"
import { DatabaseModule } from "src/database/database.module"
import { ModifyCoasterCommandHandler } from "./coaster-modification/modify-coaster.handler"

@Module({
    imports: [DatabaseModule],
    providers: [CreateCoasterInDbCommandHandler, ModifyCoasterCommandHandler],
    controllers: [CoastersController],
})
export class CoastersModule {}
