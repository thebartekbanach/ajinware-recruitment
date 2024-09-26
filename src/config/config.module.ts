import { Global, Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { EnvConfig } from "./env"
import { ApiConfig } from "./api"

const configurations = [EnvConfig, ApiConfig]

@Global()
@Module({
    imports: [ConfigModule.forRoot()],
    providers: configurations,
    exports: configurations,
})
export class AppConfigModule {}
