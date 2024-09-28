import { Module } from "@nestjs/common"
import { LeaderElectionModule } from "./leader-election/leader-election.module"
import { DataSharingModule } from "./data-sharing/data-sharing.module"

@Module({
    imports: [LeaderElectionModule, DataSharingModule],
})
export class ClusteringModule {}
