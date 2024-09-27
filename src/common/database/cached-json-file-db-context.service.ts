import { JsonFileDbContextService } from "./json-file-db-context.service"

export abstract class CachedJsonFileDbContextService<
    TEntity,
> extends JsonFileDbContextService<TEntity> {
    private static cache: Record<string, unknown> = {}

    constructor(filePath: string) {
        super(filePath)
    }

    /**
     * This method returns a immutable reference to the cache entry.
     * If the cache entry does not exist, it will be created.
     *
     * It may perform better than read() because it does not create a copy of the cache entry.
     * Good option for read-only operations. You can copy the result if you want to modify it,
     * or use read() method instead.
     *
     * @returns Immutable original reference to cache entry
     */
    async get(): Promise<ReadonlyArray<Readonly<TEntity>>> {
        const existsInCache =
            CachedJsonFileDbContextService.cache[this.filePath] !== undefined

        if (!existsInCache) {
            CachedJsonFileDbContextService.cache[this.filePath] =
                await super.read()
        }

        return CachedJsonFileDbContextService.cache[this.filePath] as TEntity[]
    }

    /**
     * This method returns a copy of the cache entry if exists, otherwise a copy of the file contents.
     * It may perform worse than get() because it creates a copy of the cache entry.
     * Copy of cache entry is returned to prevent modifications to the cache.
     *
     * May be useful when you want to modify the data without affecting the cache.
     *
     * @returns A copy of the cache entry if exists, otherwise a copy of the file contents
     */
    override async read(): Promise<TEntity[]> {
        return [...(await this.get())]
    }

    override async save(data: TEntity[]): Promise<void> {
        CachedJsonFileDbContextService.cache[this.filePath] = data
        return super.save(data)
    }
}
