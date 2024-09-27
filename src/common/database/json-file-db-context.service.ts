import { readFile, writeFile, stat, access, constants } from "fs/promises"

export abstract class JsonFileDbContextService<TEntity> {
    constructor(protected readonly filePath: string) {}

    private async checkDbPathCorrectness() {
        try {
            await access(this.filePath, constants.W_OK)
            const info = await stat(this.filePath)
            return info.isFile()
        } catch (error) {
            throw new Error(
                `Cannot write to the database file (${this.filePath}): ${error.message}`,
            )
        }
    }

    async read(): Promise<TEntity[]> {
        const fileExists = await this.checkDbPathCorrectness()
        if (!fileExists) {
            return []
        }

        const fileContents = await readFile(this.filePath, { encoding: "utf8" })
        if (fileContents.length === 0) {
            return []
        }

        try {
            return JSON.parse(fileContents)
        } catch (error) {
            throw new Error(
                `Cannot parse the database file (${this.filePath}): ${error.message}`,
            )
        }
    }

    async save(data: TEntity[]): Promise<void> {
        const fileContents = JSON.stringify(data, null, 2)
        await writeFile(this.filePath, fileContents)
    }
}
