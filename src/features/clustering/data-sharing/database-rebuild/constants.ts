// using process.env.NODE_ENV is not very nice,
// but this is just a recruitment task,
// better solution idea is here: https://github.com/nestjs/nest/issues/3912

export const createDatabaseRebuildTopic = (nodeName: string) =>
    `${process.env.NODE_ENV}.coasters.data-sharing.database-rebuild.transfer.${nodeName}`

export const DATABASE_REBUILD_CURRENT_NODE_TOPIC = createDatabaseRebuildTopic(
    process.env.NODE_NAME ?? "unknown",
)

export const DATABASE_REBUILD_REQUEST_TOPIC = `${process.env.NODE_ENV}.coasters.data-sharing.database-rebuild.request`

export const DATABASE_REBUILD_DONE_MESSAGE = "done"
