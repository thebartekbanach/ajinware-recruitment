import { RedlockModule } from "@anchan828/nest-redlock"
import { Redis } from "ioredis"
import { ClusteringConfig } from "src/config/clustering"

export const RedlockModuleDef = RedlockModule.registerAsync({
    inject: [ClusteringConfig],
    useFactory: (config: ClusteringConfig) => ({
        clients: [
            new Redis({
                host: config.redis?.host ?? "OFFLINE_MODE",
                port: config.redis?.port ?? 0,
                lazyConnect: true, // necessary for offline mode
            }),
        ],
        // https://github.com/mike-marcacci/node-redlock#configuration
        settings: {
            driftFactor: 0.01,
            retryCount: 10,
            retryDelay: 200,
            retryJitter: 200,
        },
    }),
})
