import { Inject, Injectable } from "@nestjs/common"
import { CoastersRepository } from "src/database/coasters.repository"
import { CoasterStatisticsService } from "./coaster-statistics.service"

@Injectable()
export class StatisticsQueryService {
    constructor(
        @Inject(CoastersRepository)
        private readonly coastersRepository: CoastersRepository,

        @Inject(CoasterStatisticsService)
        private readonly coasterStatisticsService: CoasterStatisticsService,
    ) {}

    async getAllCoastersStatistics() {
        const coasters = await this.coastersRepository.findAll()
        return coasters.map((coaster) =>
            this.coasterStatisticsService.convertCoasterToCoasterStatistics(
                coaster,
            ),
        )
    }
}
