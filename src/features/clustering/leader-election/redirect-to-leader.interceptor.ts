import {
    CallHandler,
    ExecutionContext,
    HttpStatus,
    Inject,
    Injectable,
    NestInterceptor,
    UseInterceptors,
} from "@nestjs/common"
import { CurrentLeaderService } from "./current-leader.service"
import { Response } from "express"
import { Observable, of } from "rxjs"

@Injectable()
export class RedirectToLeaderInterceptor implements NestInterceptor {
    constructor(
        @Inject(CurrentLeaderService)
        private readonly currentLeaderService: CurrentLeaderService,
    ) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        if (!this.currentLeaderService.clusteringModeActive) {
            return next.handle()
        }

        const response: Response = context.switchToHttp().getResponse()

        if (!this.currentLeaderService.isLeaderElected) {
            response
                .status(HttpStatus.SERVICE_UNAVAILABLE)
                .send("No leader has been elected yet")

            // prevent the request from being processed further by controller
            return of(null)
        }

        if (!this.currentLeaderService.isCurrentNodeLeader) {
            const leaderUrl =
                this.currentLeaderService.currentLeaderPublicUrl +
                response.req.originalUrl

            response.redirect(
                HttpStatus.TEMPORARY_REDIRECT,
                leaderUrl.toString(),
            )

            // prevent the request from being processed further by controller
            return of(null)
        }

        // if the current node is the leader, let the request be processed
        return next.handle()
    }
}

export function RedirectToLeader() {
    return UseInterceptors(RedirectToLeaderInterceptor)
}
