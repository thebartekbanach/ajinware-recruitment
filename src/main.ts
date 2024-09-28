import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { ApiConfig } from "./config/api"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { INestApplication, ValidationPipe } from "@nestjs/common"
import { EnvConfig } from "./config/env"
import { createWinstonLogger } from "./common/logger/create-logger"
import { MicroserviceOptions, Transport } from "@nestjs/microservices"

function setupSwagger(app: INestApplication) {
    const { environment } = app.get(EnvConfig)

    if (environment !== "development") {
        return
    }

    const { port } = app.get(ApiConfig)
    const config = new DocumentBuilder()
        .setTitle("Coaster API")
        .setVersion("1.0")
        .setDescription("The Coaster API for Ajinware recruitment purposes")
        .addServer(`http://localhost:${port}`, "Development API")
        .addTag("coasters", "Coasters management API")
        .addTag("wagons", "Wagons management API")
        .build()

    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup("/", app, document)
}

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        // winston logger is out of dependency injection scope
        // because nestjs prints to console before the logger is created
        // so we need to construct and pass it manually
        logger: createWinstonLogger(),
    })

    if (process.env.OFFLINE_MODE !== "true") {
        app.connectMicroservice<MicroserviceOptions>({
            transport: Transport.REDIS,
            options: {
                host: process.env.REDIS_HOST,
                port: Number(process.env.REDIS_PORT),
            },
        })
    }

    setupSwagger(app)
    app.useGlobalPipes(new ValidationPipe())
    const { port } = app.get(ApiConfig)

    app.enableCors()
    await app.startAllMicroservices()
    await app.listen(port)
}
bootstrap()
