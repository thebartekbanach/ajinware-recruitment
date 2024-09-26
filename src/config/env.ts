import { Inject, Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"

enum Environment {
    Development = "development",
    Production = "production",
}

@Injectable()
export class EnvConfig {
    environment: Environment

    constructor(@Inject(ConfigService) configService: ConfigService) {
        const env = configService.getOrThrow<string>("NODE_ENV")

        if (!Object.values(Environment).includes(env as Environment)) {
            throw new Error(
                `Invalid environment selected ${env}, supported envs are: ${Object.values(Environment)}`,
            )
        }

        this.environment = env as Environment
    }
}
