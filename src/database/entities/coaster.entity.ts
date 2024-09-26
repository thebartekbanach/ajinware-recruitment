import { WagonEntity } from "./wagon.entity"

export interface CoasterEntity {
    id: string
    numberOfPersonnel: number
    numberOfClientsDaily: number
    trackLength: number
    openHours: {
        from: string
        to: string
    }
    wagons: WagonEntity[]
}
