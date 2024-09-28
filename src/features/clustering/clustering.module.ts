import { Module } from "@nestjs/common"
import { LeaderElectionModule } from "./leader-election/leader-election.module"

@Module({
    imports: [LeaderElectionModule],
})
export class ClusteringModule {}
