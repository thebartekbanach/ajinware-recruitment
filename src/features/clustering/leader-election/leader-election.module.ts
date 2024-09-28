import { Global, Module } from "@nestjs/common"
import { LeaderElectionService } from "./leader-election.service"
import { LeaderElectionController } from "./leader-election.controller"
import { RedlockModuleDef } from "../redis-communication/redlock.module-def"
import { RedisClientModuleDef } from "../redis-communication/redis-client.module-def"
import {
    CurrentLeaderManagerService,
    CurrentLeaderService,
} from "./current-leader.service"
import { LeaderChangedEventHandler } from "./leader-changed.handler"

@Global()
@Module({
    imports: [RedlockModuleDef, RedisClientModuleDef],
    providers: [
        LeaderElectionService,
        CurrentLeaderService,
        CurrentLeaderManagerService,
        LeaderChangedEventHandler,
    ],
    controllers: [LeaderElectionController],
    exports: [CurrentLeaderService],
})
export class LeaderElectionModule {}
