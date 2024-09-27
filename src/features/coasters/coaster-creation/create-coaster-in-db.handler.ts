import { CommandHandler, IInferredCommandHandler } from "@nestjs/cqrs"
import { CreateCoasterCommand } from "./create-coaster.command"
import { Inject } from "@nestjs/common"
import { CoastersRepository } from "src/database/coasters.repository"

@CommandHandler(CreateCoasterCommand)
export class CreateCoasterInDbCommandHandler
    implements IInferredCommandHandler<CreateCoasterCommand>
{
    constructor(
        @Inject(CoastersRepository)
        private readonly coasters: CoastersRepository,
    ) {}

    async execute(command: CreateCoasterCommand): Promise<string> {
        const coaster = await this.coasters.create(command)
        return coaster.id
    }
}
