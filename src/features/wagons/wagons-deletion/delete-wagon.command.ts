import { Command } from "@nestjs-architects/typed-cqrs"

export type DeleteWagonCommandResult =
    | "OK"
    | "COASTER_NOT_FOUND"
    | "WAGON_NOT_FOUND"

export class DeleteWagonCommand extends Command<DeleteWagonCommandResult> {
    coasterId: string
    wagonId: string

    constructor(params: { coasterId: string; wagonId: string }) {
        super()
        Object.assign(this, params)
    }
}
