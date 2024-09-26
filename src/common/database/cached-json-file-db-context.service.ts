import { JsonFileDbContextService } from "./json-file-db-context.service"

export abstract class CachedJsonFileDbContextService<
    TEntity,
> extends JsonFileDbContextService<TEntity> {
    private static cache: Record<string, unknown> = {}

    constructor(filePath: string) {
        super(filePath)
    }

    override async read(): Promise<TEntity[]> {
        const existsInCache =
            CachedJsonFileDbContextService.cache[super.filePath] !== undefined

        if (existsInCache) {
            return CachedJsonFileDbContextService.cache[
                super.filePath
            ] as TEntity[]
        }

        return super.read()
    }

    override async save(data: TEntity[]): Promise<void> {
        CachedJsonFileDbContextService.cache[this.filePath] = data
        return super.save(data)
    }
}
