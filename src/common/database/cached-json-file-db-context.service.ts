import { JsonFileDbContextService } from "./json-file-db-context.service"

export abstract class CachedJsonFileDbContextService<
    TEntity,
> extends JsonFileDbContextService<TEntity> {
    private static cache: Record<string, unknown> = {}
    private saveDebounceTimeout: NodeJS.Timeout | null = null
    private saveDebounceDelay = 300
    private saveAwaitsQueue: Promise<void> = Promise.resolve()

    constructor(filePath: string, formatDbFile: boolean) {
        super(filePath, formatDbFile)
    }

    override async read(): Promise<TEntity[]> {
        const existsInCache =
            CachedJsonFileDbContextService.cache[this.filePath] !== undefined

        if (!existsInCache) {
            CachedJsonFileDbContextService.cache[this.filePath] =
                await super.read()
        }

        return CachedJsonFileDbContextService.cache[this.filePath] as TEntity[]
    }

    override async save(data: TEntity[]): Promise<void> {
        CachedJsonFileDbContextService.cache[this.filePath] = data

        if (this.saveDebounceTimeout) {
            clearTimeout(this.saveDebounceTimeout)
        }

        this.saveDebounceTimeout = setTimeout(async () => {
            await super.save(data)
            this.saveDebounceTimeout = null
            await this.saveAwaitsQueue
        }, this.saveDebounceDelay)

        return new Promise<void>((resolve) => {
            // Wait for the current save operation to finish
            this.saveAwaitsQueue = this.saveAwaitsQueue.then(resolve)
        })
    }
}
