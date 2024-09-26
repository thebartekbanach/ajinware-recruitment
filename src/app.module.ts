import { Module } from "@nestjs/common"
import { AppConfigModule } from "./config/config.module"
import { FeaturesModule } from "./features/features.module"

@Module({
    imports: [AppConfigModule, FeaturesModule],
})
export class AppModule {}
