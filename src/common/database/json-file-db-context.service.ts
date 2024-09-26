import { readFile, writeFile, stat } from "fs/promises"

export abstract class JsonFileDbContextService<TEntity> {
    constructor(protected readonly filePath: string) {}

    async read(): Promise<TEntity[]> {
        const fileStat = await stat(this.filePath)
        const fileExists = fileStat.isFile()

        if (!fileExists) {
            return []
        }

        const fileContents = await readFile(this.filePath, { encoding: "utf8" })
        return JSON.parse(fileContents)
    }

    async save(data: TEntity[]): Promise<void> {
        const fileContents = JSON.stringify(data, null, 2)
        await writeFile(this.filePath, fileContents)
    }
}
