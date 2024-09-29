// using process.env.NODE_ENV is not very nice,
// but this is just a recruitment task,
// better solution idea is here: https://github.com/nestjs/nest/issues/3912

export const DATABASE_SYNC_TOPIC = `${process.env.NODE_ENV}.coasters.data-sharing.database-sync.updated`
