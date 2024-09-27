import { Global, Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { EnvConfig } from "./env"
import { ApiConfig } from "./api"
import { DbConfig } from "./db"
import { ClusteringConfig } from "./clustering"

const configurations = [EnvConfig, ApiConfig, DbConfig, ClusteringConfig]

@Global()
@Module({
    imports: [ConfigModule.forRoot()],
    providers: configurations,
    exports: configurations,
})
export class AppConfigModule {}
