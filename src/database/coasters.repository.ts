import { Inject, Injectable } from "@nestjs/common"
import { CoastersDbContext } from "./contexts/coasters-db-context.service"

@Injectable()
export class CoastersRepository {
    constructor(
        @Inject(CoastersDbContext)
        private readonly dbContext: CoastersDbContext,
    ) {}
}
