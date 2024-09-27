import { Module } from "@nestjs/common"
import { WagonsController } from "./wagons.controller"
import { CreateWagonCommandHandler } from "./wagons-creation/create-wagon.handler"
import { DeleteWagonCommandHandler } from "./wagons-deletion/delete-wagon.handler"
import { DatabaseModule } from "src/database/database.module"

@Module({
    imports: [DatabaseModule],
    providers: [CreateWagonCommandHandler, DeleteWagonCommandHandler],
    controllers: [WagonsController],
})
export class WagonsModule {}
