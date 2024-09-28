import { Module } from "@nestjs/common"
import { CoastersModule } from "./coasters/coasters.module"
import { WagonsModule } from "./wagons/wagons.module"
import { ClusteringModule } from "./clustering/clustering.module"

@Module({
    imports: [ClusteringModule, CoastersModule, WagonsModule],
})
export class FeaturesModule {}
