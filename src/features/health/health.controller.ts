import { Controller, Get, Inject } from "@nestjs/common"
import { HealthCheckService } from "@nestjs/terminus"
import { DatabaseHealthIndicator } from "./database.health"
import { RedisHealthIndicator } from "./redis.health"
import {
    ApiOkResponse,
    ApiOperation,
    ApiServiceUnavailableResponse,
    ApiTags,
} from "@nestjs/swagger"

@ApiTags("health")
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
    @ApiOperation({
        summary:
            "Returns health status of the application, including database synchronization and Redis connection",
    })
    @ApiOkResponse({
        description: "Service is healthy",
    })
    @ApiServiceUnavailableResponse({
        description: "Service is unhealthy",
    })
    check() {
        return this.healthCheckService.check([
            async () => this.databaseHealthIndicator.isSynchronized(),
            async () => this.redisHealthIndicator.isConnected(),
        ])
    }
}
