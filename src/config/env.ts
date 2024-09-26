import { Inject, Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"

export enum Environment {
    Development = "development",
    Production = "production",
}

@Injectable()
export class EnvConfig {
    environment: Environment
    logsDirectory: string

    constructor(@Inject(ConfigService) configService: ConfigService) {
        const env = configService.getOrThrow<string>("NODE_ENV")

        if (!Object.values(Environment).includes(env as Environment)) {
            throw new Error(
                `Invalid environment selected ${env}, supported envs are: ${Object.values(Environment)}`,
            )
        }

        this.environment = env as Environment

        const logsDirectory = configService.getOrThrow<string>("LOGS_DIRECTORY")

        if (!logsDirectory) {
            throw new Error("Logs directory cannot be empty")
        }

        if (!logsDirectory.endsWith("/")) {
            throw new Error("Logs directory must end with a /")
        }

        this.logsDirectory = logsDirectory
    }
}
