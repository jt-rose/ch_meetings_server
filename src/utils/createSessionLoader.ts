//import DataLoader from 'dataloader'
//import { Prisma, PrismaClient } from '@prisma/client'
console.log('working on it!')

// cancel out for now while implementing graphql-nexus
/*
export const createUserLoader = () =>
  new DataLoader<number, Session>(async (sessionIds) => {
    const sessions = await prisma.workshop_sessions.findMany({
      where: {
        workshop_session_id: { in: sessionIds as Prisma.Enumerable<number> },
      },
    })
    const sessionIdToSession: Record<number, Session> = {}
    sessions.forEach((session) => {
      // will update later
      // @ts-ignore
      sessionIdToSession[session.session_id] = session
    })
    return sessionIds.map((sessionId) => sessionIdToSession[sessionId])
  })
/*
const findByIds = (ids: number[]) => Session.findByIds(ids)

const dataLoaderTemplate = (entity: Session, search: typeof findByIds) => () =>
  new DataLoader<number, typeof entity>(async (entityIds) => {
    const entities = await search(entityIds as number[])
    const entityIdToEntity: Record<number, typeof entity> = {}
    entities.forEach((singleEntity) => {
      entityIdToEntity[singleEntity.session_id] = singleEntity
    })
    return entityIds.map((entityId) => entityIdToEntity[entityId])
  })
/*
  const createDataLoader = (entity: typeof Session) => () => {
    new DataLoader<number, typeof entity>(async (entityIds) => {
        const entities = await entity.findByIds(entityIds as number[])
        const entityIdToEntity: Record<number,  typeof entity> = {}
        entities.forEach((singleEntity) => {
          entityIdToEntity[singleEntity.session_id] = singleEntity
        })
        return entityIds.map((entityId) => entityIdToEntity[entityId])
      })
  }
*/
