import { Inject, Injectable } from "@nestjs/common"
import { ClusteringConfig } from "src/config/clustering"

@Injectable()
export class CurrentLeaderService {
    private static clusterLeaderName: string | null = null
    private static clusterLeaderPublicUrl: string | null = null

    protected setLeader(nodeId: string, publicUrl: string) {
        CurrentLeaderService.clusterLeaderName = nodeId
        CurrentLeaderService.clusterLeaderPublicUrl = publicUrl
    }

    constructor(private readonly clusteringConfig: ClusteringConfig) {}

    get isLeaderElected(): boolean {
        return !!CurrentLeaderService.clusterLeaderName
    }

    get currentLeaderName(): string {
        if (!CurrentLeaderService.clusterLeaderName) {
            throw new Error("No leader has been elected yet")
        }

        return CurrentLeaderService.clusterLeaderName!
    }

    get currentLeaderPublicUrl(): string {
        if (!CurrentLeaderService.clusterLeaderName) {
            throw new Error("No leader has been elected yet")
        }

        return CurrentLeaderService.clusterLeaderPublicUrl!
    }

    get isCurrentNodeLeader(): boolean {
        return this.currentLeaderName === this.clusteringConfig.node.name
    }

    get clusteringModeActive(): boolean {
        return !this.clusteringConfig.offlineMode
    }
}

@Injectable()
export class CurrentLeaderManagerService extends CurrentLeaderService {
    constructor(
        @Inject(ClusteringConfig)
        clusteringConfig: ClusteringConfig,
    ) {
        super(clusteringConfig)
    }

    // We do not want to expose the setter to the outside world,
    // so we create a method in subclass that will call the setter
    setLeaderInformation(nodeId: string, publicUrl: string) {
        this.setLeader(nodeId, publicUrl)
    }
}
