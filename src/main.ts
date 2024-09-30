import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { ApiConfig } from "./config/api"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { INestApplication, ValidationPipe } from "@nestjs/common"
import { createWinstonLogger } from "./common/logger/create-logger"
import { MicroserviceOptions, Transport } from "@nestjs/microservices"
import { WsAdapter } from "@nestjs/platform-ws"
import { ClusteringConfig } from "./config/clustering"

function setupSwagger(app: INestApplication) {
    // For demonstration purposes we are unlocking swagger on "prod",
    // but in real life application, we would leave it uncommented,
    // as we probably do not want to share our api definition with strangers

    // const { environment } = app.get(EnvConfig)
    // if (environment !== "development") {
    //     return
    // }

    const { node } = app.get(ClusteringConfig)

    const config = new DocumentBuilder()
        .setTitle("Coaster API")
        .setVersion("1.0")
        .setDescription("The Coaster API for Ajinware recruitment purposes")
        .addTag("coasters", "Coasters management API")
        .addTag("wagons", "Wagons management API")
        .addTag("health", "Microservice health API")
        .addTag("statistics", "Coasters statistics API")
        .addServer(node.baseUrl)
        .build()

    const document = SwaggerModule.createDocument(app, config)
    app.getHttpAdapter().get("/", (req, res) => {
        res.json(document)
    })
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

    app.enableCors()
    app.useGlobalPipes(new ValidationPipe())
    app.useWebSocketAdapter(new WsAdapter(app))

    const { port } = app.get(ApiConfig)
    await app.startAllMicroservices()
    await app.listen(port)
}
bootstrap()
