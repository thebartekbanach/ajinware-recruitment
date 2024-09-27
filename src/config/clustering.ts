import { Inject, Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"

@Injectable()
export class ClusteringConfig {
    node: {
        name: string
        baseUrl: string
    }

    redis: {
        host: string
        port: number
    } | null

    constructor(@Inject(ConfigService) configService: ConfigService) {
        this.node = {
            name: configService.getOrThrow<string>("NODE_NAME"),
            baseUrl: configService.getOrThrow<string>("NODE_BASE_URL"),
        }

        if (this.node.name.length === 0) {
            throw new Error("NODE_NAME cannot be empty")
        }

        if (this.node.baseUrl.length === 0) {
            throw new Error("NODE_BASE_URL cannot be empty")
        }

        const offlineMode = configService.get<string>("OFFLINE_MODE")
        if (offlineMode === "true") {
            this.redis = null
            return
        }

        const host = configService.getOrThrow<string>("REDIS_HOST")
        const port = configService.getOrThrow<number>("REDIS_PORT")

        this.redis = {
            host,
            port,
        }
    }

    get offlineMode() {
        return this.redis === null
    }
}
