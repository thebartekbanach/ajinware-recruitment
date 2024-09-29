import { Command } from "@nestjs-architects/typed-cqrs"

export type CreateWagonCommandResult = "OK" | "COASTER_NOT_FOUND"

export class CreateWagonCommand extends Command<CreateWagonCommandResult> {
    coasterId: string
    numberOfSeats: number

    constructor(params: { coasterId: string; numberOfSeats: number }) {
        super()
        Object.assign(this, params)
    }
}
