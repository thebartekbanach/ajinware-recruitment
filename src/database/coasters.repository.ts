import { Inject, Injectable } from "@nestjs/common"
import { CoastersDbContext } from "./contexts/coasters-db-context.service"
import { CoasterEntity } from "./entities/coaster.entity"

interface CreateCoasterDto {
    numberOfPersonnel: number
    numberOfClientsDaily: number
    trackLength: number
    openHour: string
    closeHour: string
}

interface UpdateCoasterDto {
    coasterId: string
    numberOfPersonnel?: number
    numberOfClientsDaily?: number
    openHour?: string
    closeHour?: string
}

@Injectable()
export class CoastersRepository {
    constructor(
        @Inject(CoastersDbContext)
        private readonly dbContext: CoastersDbContext,
    ) {}

    async findAll() {
        return this.dbContext.read()
    }

    async findById(id: string): Promise<Readonly<CoasterEntity> | null> {
        const coasters = await this.dbContext.read()
        return coasters.find((c) => c.id === id) || null
    }

    async create(info: CreateCoasterDto): Promise<CoasterEntity> {
        const existingCoasters = await this.dbContext.read()

        const newCoasterId = `A${existingCoasters.length + 1}`
        const coaster: CoasterEntity = {
            id: newCoasterId,
            numberOfPersonnel: info.numberOfPersonnel,
            numberOfClientsDaily: info.numberOfClientsDaily,
            trackLength: info.trackLength,
            openHours: {
                from: info.openHour,
                to: info.closeHour,
            },
            wagons: [],
        }

        existingCoasters.push(coaster)

        await this.dbContext.save(existingCoasters)
        return coaster
    }

    async update(coaster: UpdateCoasterDto): Promise<CoasterEntity | null> {
        const existingCoasters = await this.dbContext.read()
        const coasterToUpdate = existingCoasters.find(
            (c) => c.id === coaster.coasterId,
        )

        if (!coasterToUpdate) {
            return null
        }

        if (coaster.numberOfPersonnel) {
            coasterToUpdate.numberOfPersonnel = coaster.numberOfPersonnel
        }

        if (coaster.numberOfClientsDaily) {
            coasterToUpdate.numberOfClientsDaily = coaster.numberOfClientsDaily
        }

        if (coaster.openHour) {
            coasterToUpdate.openHours.from = coaster.openHour
        }

        if (coaster.closeHour) {
            coasterToUpdate.openHours.to = coaster.closeHour
        }

        await this.dbContext.save(existingCoasters)
        return coasterToUpdate
    }

    async createOrUpdate(coaster: CoasterEntity): Promise<CoasterEntity> {
        const existingCoasters = await this.dbContext.read()
        const coasterToUpdate = existingCoasters.find(
            (c) => c.id === coaster.id,
        )

        if (coasterToUpdate) {
            coasterToUpdate.numberOfPersonnel = coaster.numberOfPersonnel
            coasterToUpdate.numberOfClientsDaily = coaster.numberOfClientsDaily
            coasterToUpdate.trackLength = coaster.trackLength
            coasterToUpdate.openHours = coaster.openHours
            coasterToUpdate.wagons = coaster.wagons
        } else {
            existingCoasters.push(coaster)
        }

        await this.dbContext.save(existingCoasters)
        return coaster
    }

    async dropDatabase() {
        await this.dbContext.save([])
    }
}
