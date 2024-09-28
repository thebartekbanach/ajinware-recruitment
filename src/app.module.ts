import { Module } from "@nestjs/common"
import { AppConfigModule } from "./config/config.module"
import { FeaturesModule } from "./features/features.module"
import { CqrsModule } from "@nestjs/cqrs"
import { WinstonModule } from "nest-winston"
import { createWinstonModuleConfig } from "./common/logger/create-logger"

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
        CqrsModule.forRoot(),
        FeaturesModule,
    ],
})
export class AppModule {}
