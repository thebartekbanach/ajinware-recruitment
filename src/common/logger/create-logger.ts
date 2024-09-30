import {
    utilities as WinstonModuleUtilities,
    WinstonModule,
} from "nest-winston"
import { Environment } from "src/config/env"
import * as winston from "winston"

function inLogsDirectory(fileName: string) {
    return process.env.LOGS_DIRECTORY + fileName
}

const makeFileSelectiveOutputFilter = (
    targetLevel: string,
    isProduction: boolean,
) =>
    winston.format((log: winston.Logform.TransformableInfo) => {
        const isAllowedInProduction = ["error", "warn"].includes(log.level)
        if (isProduction && !isAllowedInProduction) {
            return false
        }

        return log.level === targetLevel ? log : false
    })()

export function createWinstonModuleConfig(isProduction: boolean) {
    return {
        level: isProduction ? "warn" : "info",

        transports: [
            new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.ms(),
                    WinstonModuleUtilities.format.nestLike("CoastersApp", {
                        colors: true,
                        prettyPrint: true,
                    }),
                ),
            }),

            new winston.transports.File({
                filename: inLogsDirectory("error.log"),
                level: "error",
                format: winston.format.combine(
                    winston.format.json(),
                    makeFileSelectiveOutputFilter("error", isProduction),
                ),
            }),

            new winston.transports.File({
                filename: inLogsDirectory("warn.log"),
                level: "warn",
                format: winston.format.combine(
                    winston.format.json(),
                    makeFileSelectiveOutputFilter("warn", isProduction),
                ),
            }),

            new winston.transports.File({
                filename: inLogsDirectory("info.log"),
                level: "info",
                format: winston.format.combine(
                    winston.format.json(),
                    makeFileSelectiveOutputFilter("info", isProduction),
                ),
            }),
        ],
    }
}

export function createWinstonLogger() {
    return WinstonModule.createLogger(
        createWinstonModuleConfig(
            process.env.NODE_ENV === Environment.Production,
        ),
    )
}
