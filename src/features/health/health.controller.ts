import { Controller, Get, Inject } from "@nestjs/common"
import { HealthCheckService } from "@nestjs/terminus"
import { DatabaseHealthIndicator } from "./database.health"
import { RedisHealthIndicator } from "./redis.health"

@Controller("health")
export class HealthController {
    constructor(
        @Inject(HealthCheckService)
        private readonly healthCheckService: HealthCheckService,
        @Inject(DatabaseHealthIndicator)
        private readonly databaseHealthIndicator: DatabaseHealthIndicator,
        @Inject(RedisHealthIndicator)
        private readonly redisHealthIndicator: RedisHealthIndicator,
    ) {}

    @Get()
    check() {
        return this.healthCheckService.check([
            async () => this.databaseHealthIndicator.isSynchronized(),
            async () => this.redisHealthIndicator.isConnected(),
        ])
    }
}
