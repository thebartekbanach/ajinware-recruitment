import { Inject, Injectable, NestMiddleware } from "@nestjs/common"
import { Request, Response, NextFunction } from "express"
import { ClusteringConfig } from "src/config/clustering"

@Injectable()
export class NodeNameHeaderInjectionMiddleware implements NestMiddleware {
    constructor(
        @Inject(ClusteringConfig)
        private readonly clusteringConfig: ClusteringConfig,
    ) {}

    use(req: Request, res: Response, next: NextFunction) {
        if (!this.clusteringConfig.offlineMode) {
            res.setHeader("X-Node-Name", this.clusteringConfig.node.name)
        }

        next()
    }
}
