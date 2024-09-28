import { Module, Provider } from "@nestjs/common"
import { LAZY_REDIS_CLIENT } from "./di.constants"
import { Redis } from "ioredis"
import { ClusteringConfig } from "src/config/clustering"

const LazyRedisProvider: Provider = {
    provide: LAZY_REDIS_CLIENT,
    inject: [ClusteringConfig],
    useFactory: (config: ClusteringConfig) =>
        new Redis({
            host: config.redis?.host ?? "OFFLINE_MODE",
            port: config.redis?.port ?? 0,
            lazyConnect: true, // necessary for offline mode
        }),
}

@Module({
    providers: [LazyRedisProvider],
    exports: [LazyRedisProvider],
})
export class LazyRedisClientModule {}
