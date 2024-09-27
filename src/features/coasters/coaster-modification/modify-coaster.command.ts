import { Command } from "@nestjs-architects/typed-cqrs"

export type ModifyCoasterCommandResult =
    | "OK"
    | "COASTER_NOT_FOUND"
    | "NO_FIELDS_PROVIDED"

export class ModifyCoasterCommand extends Command<ModifyCoasterCommandResult> {
    coasterId: string
    numberOfPersonnel?: number
    numberOfClientsDaily?: number
    openHour?: string
    closeHour?: string

    constructor(params: {
        coasterId: string
        numberOfPersonnel?: number
        numberOfClientsDaily?: number
        openHour?: string
        closeHour?: string
    }) {
        super()
        Object.assign(this, params)
    }
}
