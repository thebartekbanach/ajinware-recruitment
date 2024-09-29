import { Inject, Injectable } from "@nestjs/common"
import { CoastersDbContext } from "./contexts/coasters-db-context.service"

interface CreateWagonDto {
    coasterId: string
    numberOfSeats: number
}

interface RemoveWagonDto {
    coasterId: string
    wagonId: string
}

type RemoveWagonErrorReason = "COASTER_NOT_FOUND" | "WAGON_NOT_FOUND"

@Injectable()
export class WagonsRepository {
    constructor(
        @Inject(CoastersDbContext)
        private readonly dbContext: CoastersDbContext,
    ) {}

    async addWagon(data: CreateWagonDto): Promise<boolean> {
        const existingCoasters = await this.dbContext.read()
        const coaster = existingCoasters.find((c) => c.id === data.coasterId)

        if (!coaster) {
            return false
        }

        coaster.wagons.push({
            id: `W${coaster.wagons.length + 1}`,
            numberOfSeats: data.numberOfSeats,
        })

        await this.dbContext.save(existingCoasters)

        return true
    }

    async removeWagon(
        data: RemoveWagonDto,
    ): Promise<RemoveWagonErrorReason | null> {
        const existingCoasters = await this.dbContext.read()
        const coaster = existingCoasters.find((c) => c.id === data.coasterId)

        if (!coaster) {
            return "COASTER_NOT_FOUND"
        }

        const wagon = coaster.wagons.find((w) => w.id === data.wagonId)
        if (!wagon) {
            return "WAGON_NOT_FOUND"
        }

        coaster.wagons = coaster.wagons.filter((w) => w.id !== data.wagonId)
        await this.dbContext.save(existingCoasters)

        return null
    }
}
