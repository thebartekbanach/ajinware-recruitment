import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { ApiConfig } from "./config/api"

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    const { port } = app.get(ApiConfig)
    await app.listen(port)
}
bootstrap()
