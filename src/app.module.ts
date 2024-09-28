import { MiddlewareConsumer, Module } from "@nestjs/common"
import { AppConfigModule } from "./config/config.module"
import { FeaturesModule } from "./features/features.module"
import { CqrsModule } from "@nestjs/cqrs"
import { ScheduleModule } from "@nestjs/schedule"
import { WinstonModule } from "nest-winston"
import { EnvConfig, Environment } from "./config/env"
import { createWinstonModuleConfig } from "./common/logger/create-logger"
import { NodeNameHeaderInjectionMiddleware } from "./common/middlewares/node-name-header-injection.middleware"

@Module({
    imports: [
        AppConfigModule,
        WinstonModule.forRootAsync({
            inject: [EnvConfig],
            useFactory: (env: EnvConfig) =>
                createWinstonModuleConfig(
                    env.environment === Environment.Production,
                ),
        }),
        ScheduleModule.forRoot(),
        CqrsModule.forRoot(),
        FeaturesModule,
    ],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(NodeNameHeaderInjectionMiddleware).forRoutes("*")
    }
}
