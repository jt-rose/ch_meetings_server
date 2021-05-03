import DataLoader from 'dataloader'
import { Session } from '../entities/SESSION'

export const createUserLoader = () =>
  new DataLoader<number, Session>(async (sessionIds) => {
    const sessions = await Session.findByIds(sessionIds as number[])
    const sessionIdToSession: Record<number, Session> = {}
    sessions.forEach((session) => {
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

  */
