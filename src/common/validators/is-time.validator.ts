import { registerDecorator, ValidationOptions } from "class-validator"

export function isTimeString(value: unknown): value is string {
    if (typeof value !== "string") {
        return false
    }

    const [hour, minute] = value.split(":").map(Number)
    if (isNaN(hour) || isNaN(minute)) {
        return false
    }

    if (hour < 0 || hour > 23) {
        return false
    }

    if (minute < 0 || minute > 59) {
        return false
    }

    return true
}

export function IsTimeString(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            name: "isTimeString",
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                defaultMessage(args) {
                    return `${args?.property} should be a valid time string`
                },
                validate: isTimeString,
            },
        })
    }
}
