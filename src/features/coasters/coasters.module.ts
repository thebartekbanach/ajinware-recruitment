import { Module } from "@nestjs/common"
import { CoastersController } from "./coasters.controller"

@Module({
    controllers: [CoastersController],
})
export class CoastersModule {}
