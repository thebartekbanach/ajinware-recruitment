import { Injectable } from "@nestjs/common"
import { CoasterEntity } from "src/database/entities/coaster.entity"
import { CoasterStatisticsDto } from "./coaster-statistics.dto"

const NUMBER_OF_BASE_PERSONNEL = 1
const NUMBER_OF_PERSONNEL_PER_WAGON = 2
const WAGON_SERVICE_TIME_IN_SECONDS = 5 * 60

@Injectable()
export class CoasterStatisticsService {
    convertCoasterToCoasterStatistics(
        coaster: CoasterEntity,
    ): CoasterStatisticsDto {
        return {
            id: coaster.id,
            availablePersonnelNumber: coaster.numberOfPersonnel,
            availableWagonsNumber: coaster.wagons.length,
            numberOfClientsDaily: coaster.numberOfClientsDaily,
            openHour: coaster.openHours.from,
            closeHour: coaster.openHours.to,
            expectedPersonnelNumber:
                this.calculateExpectedPersonnelNumber(coaster),
            numberOfClientsCanBeServedDaily:
                this.calculateNumberOfClientsCanBeServedDaily(coaster),
        }
    }

    private calculateExpectedPersonnelNumber(coaster: CoasterEntity): number {
        return (
            NUMBER_OF_BASE_PERSONNEL +
            NUMBER_OF_PERSONNEL_PER_WAGON * coaster.wagons.length
        )
    }

    private calculateNumberOfClientsCanBeServedDaily(
        coaster: CoasterEntity,
    ): number {
        const coasterTotalDayWorkingTime =
            this.calculateCoasterTotalDayWorkingTime(coaster)

        const singleRideTime =
            coaster.trackLength / coaster.wagonSpeed +
            WAGON_SERVICE_TIME_IN_SECONDS

        const numberOfRidesPerDay = Math.floor(
            coasterTotalDayWorkingTime / singleRideTime,
        )

        const totalNumberOfSeats = coaster.wagons.reduce(
            (acc, wagon) => acc + wagon.numberOfSeats,
            0,
        )

        return numberOfRidesPerDay * totalNumberOfSeats
    }

    private calculateCoasterTotalDayWorkingTime(
        coaster: CoasterEntity,
    ): number {
        const openTimeInSeconds = this.timeToSeconds(coaster.openHours.from)
        const closeTimeInSeconds = this.timeToSeconds(coaster.openHours.to)
        return Math.abs(closeTimeInSeconds - openTimeInSeconds)
    }

    private timeToSeconds(time: string): number {
        const [hours, minutes] = time.split(":").map((part) => parseInt(part))
        return hours * 60 * 60 + minutes * 60
    }
}
