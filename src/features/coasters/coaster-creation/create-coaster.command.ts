import { Command } from "@nestjs-architects/typed-cqrs"

export class CreateCoasterCommand extends Command<string> {
    numberOfPersonnel: number
    numberOfClientsDaily: number
    trackLength: number
    wagonSpeed: number
    openHour: string
    closeHour: string

    constructor(params: {
        numberOfPersonnel: number
        numberOfClientsDaily: number
        trackLength: number
        wagonSpeed: number
        openHour: string
        closeHour: string
    }) {
        super()
        Object.assign(this, params)
    }
}
