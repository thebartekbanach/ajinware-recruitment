import { Module } from "@nestjs/common"
import { CoastersModule } from "./coasters/coasters.module"
import { WagonsModule } from "./wagons/wagons.module"
import { ClusteringModule } from "./clustering/clustering.module"
import { HealthModule } from "./health/health.module"

@Module({
    imports: [ClusteringModule, HealthModule, CoastersModule, WagonsModule],
})
export class FeaturesModule {}
