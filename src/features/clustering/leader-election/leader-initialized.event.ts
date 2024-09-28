export class LeaderInitializedEvent {
    constructor(
        public readonly leaderNodeName: string,
        public readonly leaderNodePublicUrl: string,
    ) {}
}
