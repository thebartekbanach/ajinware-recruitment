import { ClientsModule, Transport } from "@nestjs/microservices"
import { REDIS_CLIENT_PROXY } from "./di.constants"
import { ClusteringConfig } from "src/config/clustering"

export const RedisClientModuleDef = ClientsModule.registerAsync({
    isGlobal: true,
    clients: [
        {
            name: REDIS_CLIENT_PROXY,
            inject: [ClusteringConfig],
            useFactory: (config: ClusteringConfig) => ({
                transport: Transport.REDIS,
                options: {
                    host: config.redis?.host ?? "OFFLINE_MODE",
                    port: config.redis?.port ?? 0,
                    lazyConnect: true, // necessary for offline mode
                },
            }),
        },
    ],
})
