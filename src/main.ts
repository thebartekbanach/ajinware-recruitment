import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { ApiConfig } from "./config/api"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { INestApplication } from "@nestjs/common"
import { EnvConfig } from "./config/env"
import { createWinstonLogger } from "./common/logger/create-logger"

function setupSwagger(app: INestApplication) {
    const { environment } = app.get(EnvConfig)

    if (environment !== "development") {
        return
    }

    const config = new DocumentBuilder()
        .setTitle("Coaster API")
        .setVersion("1.0")
        .addTag("coasters")
        .build()

    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup("api", app, document)
}

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: createWinstonLogger(),
    })
    setupSwagger(app)
    const { port } = app.get(ApiConfig)
    await app.listen(port)
}
bootstrap()
