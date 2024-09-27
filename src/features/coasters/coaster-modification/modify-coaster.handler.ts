import { CommandHandler, IInferredCommandHandler } from "@nestjs/cqrs"
import { Inject } from "@nestjs/common"
import { CoastersRepository } from "src/database/coasters.repository"
import {
    ModifyCoasterCommand,
    ModifyCoasterCommandResult,
} from "./modify-coaster.command"

@CommandHandler(ModifyCoasterCommand)
export class ModifyCoasterCommandHandler
    implements IInferredCommandHandler<ModifyCoasterCommand>
{
    constructor(
        @Inject(CoastersRepository)
        private readonly coasters: CoastersRepository,
    ) {}

    async execute(
        command: ModifyCoasterCommand,
    ): Promise<ModifyCoasterCommandResult> {
        if (
            !command.numberOfPersonnel &&
            !command.numberOfClientsDaily &&
            !command.openHour &&
            !command.closeHour
        ) {
            return "NO_FIELDS_PROVIDED"
        }

        const coaster = await this.coasters.update(command)
        if (coaster === null) {
            return "COASTER_NOT_FOUND"
        }

        return "OK"
    }
}
