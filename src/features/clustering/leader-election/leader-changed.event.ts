export class LeaderChangedEvent {
    constructor(
        public readonly leaderNodeName: string,
        public readonly leaderNodePublicUrl: string,
    ) {}

    static fromJSON(json: string): LeaderChangedEvent {
        const parsed = JSON.parse(json)
        return new LeaderChangedEvent(
            parsed.leaderNodeName,
            parsed.leaderNodePublicUrl,
        )
    }

    toJSON(): string {
        return JSON.stringify({
            leaderNodeName: this.leaderNodeName,
            leaderNodePublicUrl: this.leaderNodePublicUrl,
        })
    }
}
