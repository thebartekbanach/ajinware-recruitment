import { readFile, writeFile, access, constants } from "fs/promises"

export abstract class JsonFileDbContextService<TEntity> {
    constructor(
        protected readonly filePath: string,
        private readonly formatDbFile: boolean,
    ) {}

    private async initializeDbFile() {
        try {
            await writeFile(this.filePath, "[]")
        } catch (error) {
            throw new Error(
                `Cannot initialize the database file (${this.filePath}): ${error.message}`,
            )
        }
    }

    private async checkDbPathCorrectness() {
        try {
            await access(this.filePath, constants.W_OK)
            return true
        } catch (error) {
            if (error.code === "ENOENT") {
                await this.initializeDbFile()
                return true
            }

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
        const fileContents = this.formatDbFile
            ? JSON.stringify(data, null, 2) // Pretty print with 2 spaces
            : JSON.stringify(data) // Compact JSON

        await writeFile(this.filePath, fileContents)
    }
}
