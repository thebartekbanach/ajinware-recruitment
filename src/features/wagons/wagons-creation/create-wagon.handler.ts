import { CommandHandler, IInferredCommandHandler } from "@nestjs/cqrs"
import {
    CreateWagonCommand,
    CreateWagonCommandResult,
} from "./create-wagon.command"
import { Inject } from "@nestjs/common"
import { WagonsRepository } from "src/database/wagons.repository"

@CommandHandler(CreateWagonCommand)
export class CreateWagonCommandHandler
    implements IInferredCommandHandler<CreateWagonCommand>
{
    constructor(
        @Inject(WagonsRepository)
        private readonly coasters: WagonsRepository,
    ) {}

    async execute(
        command: CreateWagonCommand,
    ): Promise<CreateWagonCommandResult> {
        const wagonAdded = await this.coasters.addWagon({
            coasterId: command.coasterId,
            numberOfSeats: command.numberOfSeats,
            wagonSpeed: command.wagonSpeed,
        })

        if (!wagonAdded) {
            return "COASTER_NOT_FOUND"
        }

        return "OK"
    }
}
