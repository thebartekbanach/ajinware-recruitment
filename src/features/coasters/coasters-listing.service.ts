import { Inject, Injectable } from "@nestjs/common"
import { CoastersRepository } from "src/database/coasters.repository"
import { CoasterDto } from "./dtos/coaster.dto"

@Injectable()
export class CoastersListingService {
    constructor(
        @Inject(CoastersRepository)
        private readonly coastersRepository: CoastersRepository,
    ) {}

    async getAllCoasters(): Promise<CoasterDto[]> {
        const coasters = await this.coastersRepository.findAll()

        return coasters.map((coaster) => ({
            id: coaster.id,
            numberOfPersonnel: coaster.numberOfPersonnel,
            numberOfClientsDaily: coaster.numberOfClientsDaily,
            trackLength: coaster.trackLength,
            openHour: coaster.openHours.from,
            closeHour: coaster.openHours.to,
            wagons: coaster.wagons.map((wagon) => ({
                id: wagon.id,
                numberOfSeats: wagon.numberOfSeats,
                wagonSpeed: wagon.wagonSpeed,
            })),
        }))
    }
}
