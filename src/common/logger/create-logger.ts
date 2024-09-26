import {
    utilities as WinstonModuleUtilities,
    WinstonModule,
} from "nest-winston"
import { Environment } from "src/config/env"
import * as winston from "winston"

function inLogsDirectory(fileName: string) {
    return process.env.LOGS_DIRECTORY + fileName
}

export function createWinstonLogger() {
    return WinstonModule.createLogger({
        level:
            process.env.NODE_ENV === Environment.Production ? "warn" : "info",

        transports: [
            new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.ms(),
                    WinstonModuleUtilities.format.nestLike("CoastersApp", {
                        colors: true,
                        prettyPrint: true,
                        processId: true,
                        appName: true,
                    }),
                ),
            }),

            new winston.transports.File({
                filename: inLogsDirectory("error.log"),
                level: "error",
                format: winston.format.json(),
            }),

            new winston.transports.File({
                filename: inLogsDirectory("warn.log"),
                level: "warn",
                format: winston.format.json(),
            }),

            new winston.transports.File({
                filename: inLogsDirectory("info.log"),
                format: winston.format.json(),
            }),
        ],
    })
}
