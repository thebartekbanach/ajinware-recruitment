import { RedlockModule } from "@anchan828/nest-redlock"
import { Redis } from "ioredis"
import { LazyRedisClientModule } from "./lazy-redis-client.module"
import { LAZY_REDIS_CLIENT } from "./di.constants"

export const RedlockModuleDef = RedlockModule.registerAsync({
    imports: [LazyRedisClientModule],
    inject: [LAZY_REDIS_CLIENT],
    useFactory: (client: Redis) => ({
        clients: [client],
        // https://github.com/mike-marcacci/node-redlock#configuration
        settings: {
            driftFactor: 0.01,
            retryCount: 10,
            retryDelay: 200,
            retryJitter: 200,
        },
    }),
})
