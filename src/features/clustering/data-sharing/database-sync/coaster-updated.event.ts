import { CoasterEntity } from "src/database/entities/coaster.entity"

export class CoasterUpdatedEvent {
    constructor(
        public readonly coaster: Readonly<CoasterEntity>,
        public readonly emitterNodeName: string,
    ) {}

    static fromJSON(json: string) {
        const parsed = JSON.parse(json)
        return new CoasterUpdatedEvent(parsed.coaster, parsed.emitterNodeName)
    }

    toJSON(): string {
        return JSON.stringify({
            coaster: this.coaster,
            emitterNodeName: this.emitterNodeName,
        })
    }
}
