import { CommandHandler, IInferredCommandHandler } from "@nestjs/cqrs"
import {
    DeleteWagonCommand,
    DeleteWagonCommandResult,
} from "./delete-wagon.command"
import { Inject } from "@nestjs/common"
import { WagonsRepository } from "src/database/wagons.repository"

@CommandHandler(DeleteWagonCommand)
export class DeleteWagonCommandHandler
    implements IInferredCommandHandler<DeleteWagonCommand>
{
    constructor(
        @Inject(WagonsRepository)
        private readonly coasters: WagonsRepository,
    ) {}

    async execute(
        command: DeleteWagonCommand,
    ): Promise<DeleteWagonCommandResult> {
        const error = await this.coasters.removeWagon({
            coasterId: command.coasterId,
            wagonId: command.wagonId,
        })

        if (error != null) {
            return error
        }

        return "OK"
    }
}
