import { Module } from "@nestjs/common"
import { TerminusModule } from "@nestjs/terminus"
import { DatabaseHealthIndicator } from "./database.health"
import { RedisHealthIndicator } from "./redis.health"
import { HealthController } from "./health.controller"
import { DatabaseRebuildModule } from "../clustering/data-sharing/database-rebuild/database-rebuild.module"
import { LazyRedisClientModule } from "../clustering/redis-communication/lazy-redis-client.module"

@Module({
    imports: [TerminusModule, LazyRedisClientModule, DatabaseRebuildModule],
    providers: [DatabaseHealthIndicator, RedisHealthIndicator],
    controllers: [HealthController],
})
export class HealthModule {}
