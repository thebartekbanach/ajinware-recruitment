import { Inject, Injectable } from "@nestjs/common"
import {
    HealthCheckError,
    HealthIndicator,
    HealthIndicatorResult,
} from "@nestjs/terminus"
import { ClusteringConfig } from "src/config/clustering"
import { LAZY_REDIS_CLIENT } from "../clustering/redis-communication/di.constants"
import { Redis } from "ioredis"

@Injectable()
export class RedisHealthIndicator extends HealthIndicator {
    constructor(
        @Inject(ClusteringConfig) private readonly config: ClusteringConfig,
        @Inject(LAZY_REDIS_CLIENT) private readonly redis: Redis,
    ) {
        super()
    }

    async isConnected(): Promise<HealthIndicatorResult> {
        if (this.config.offlineMode) {
            return this.getStatus("redis", true, {
                status: "node is running in offline mode",
            })
        }

        try {
            await this.redis.ping()
            return this.getStatus("redis", true, {
                status: "up",
            })
        } catch (error) {
            throw new HealthCheckError("Redis is not available", {
                redis: {
                    status: "down",
                    error: error.message,
                },
            })
        }
    }
}
