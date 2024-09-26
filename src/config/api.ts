import { Inject, Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"

@Injectable()
export class ApiConfig {
    port: number

    constructor(@Inject(ConfigService) configService: ConfigService) {
        this.port = configService.getOrThrow<number>("PORT")

        if (this.port < 0 || this.port > 65535) {
            throw new Error(
                `Invalid port selected ${this.port}, supported ports are 0-65535`,
            )
        }
    }
}
