import { Module } from "@nestjs/common"
import { AppConfigModule } from "./config/config.module"
import { FeaturesModule } from "./features/features.module"
import { CqrsModule } from "@nestjs/cqrs"

@Module({
    imports: [CqrsModule.forRoot(), AppConfigModule, FeaturesModule],
})
export class AppModule {}
