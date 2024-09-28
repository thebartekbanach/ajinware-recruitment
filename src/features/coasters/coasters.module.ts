import { Module } from "@nestjs/common"
import { CoastersController } from "./coasters.controller"
import { CreateCoasterCommandHandler } from "./coaster-creation/create-coaster.handler"
import { DatabaseModule } from "src/database/database.module"
import { ModifyCoasterCommandHandler } from "./coaster-modification/modify-coaster.handler"
import { CoastersListingService } from "./coasters-listing.service"

@Module({
    imports: [DatabaseModule],
    providers: [
        CreateCoasterCommandHandler,
        ModifyCoasterCommandHandler,
        CoastersListingService,
    ],
    controllers: [CoastersController],
})
export class CoastersModule {}
