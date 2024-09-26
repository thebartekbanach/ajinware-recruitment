import { Inject, Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"

@Injectable()
export class DbConfig {
    coastersDatabasePath: string

    constructor(@Inject(ConfigService) configService: ConfigService) {
        this.coastersDatabasePath = configService.getOrThrow<string>(
            "COASTERS_DATABASE_PATH",
        )

        if (this.coastersDatabasePath === "") {
            throw new Error("Invalid coasters database path provided")
        }

        if (this.coastersDatabasePath.endsWith("/")) {
            throw new Error(
                "Coasters database path should be a file path, not a directory path",
            )
        }
    }
}
