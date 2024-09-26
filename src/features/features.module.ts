import { Module } from "@nestjs/common"
import { CoastersModule } from "./coasters/coasters.module"
import { WagonsModule } from "./wagons/wagons.module"

@Module({
    imports: [CoastersModule, WagonsModule],
})
export class FeaturesModule {}
