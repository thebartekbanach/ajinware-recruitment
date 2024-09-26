import { Module } from "@nestjs/common"
import { WagonsController } from "./wagons.controller"

@Module({
    controllers: [WagonsController],
})
export class WagonsModule {}
