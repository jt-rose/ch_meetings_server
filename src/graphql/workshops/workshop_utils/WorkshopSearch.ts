import { Field, InputType } from 'type-graphql'
import { SESSION_STATUS } from '../../enums/SESSION_STATUS'

/* ----------------------------- order by fields ---------------------------- */

type SortByColumnName =
  | 'workshop_start_time'
  | 'workshop_end_time'
  | 'workshop_status'
// client name alphabetical
// course alphabetical
type SortByDirection = 'asc' | 'desc'

@InputType()
export class WorkshopsOrderBy {
  @Field(() => String)
  column: SortByColumnName
  @Field(() => String)
  direction: SortByDirection
}

export const parseWorkshopOrderByArgs = (orderBy: WorkshopsOrderBy) => {
  switch (orderBy.column) {
    case 'workshop_start_time':
      return {
        workshop_start_time: orderBy.direction,
      }
    case 'workshop_end_time':
      return {
        workshop_end_time: orderBy.direction,
      }
    case 'workshop_status':
      return {
        workshop_status: orderBy.direction,
      }
    default:
      throw Error('Error! Incorrect order by column name submitted')
  }
}

/* ------------------------------ where fields ------------------------------ */

@InputType()
export class WorkshopFilterOptions {
  @Field({ nullable: true })
  assigned_advisor_id?: number

  @Field({ nullable: true })
  group_id?: number

  @Field({ nullable: true })
  client_id?: number

  // format as { contains, mode: 'insensitive'}
  @Field({ nullable: true })
  cohort_name?: string

  @Field({ nullable: true })
  deleted?: boolean

  @Field({ nullable: true })
  in_person?: boolean

  // format as { equals, mode: 'insensitive'}
  @Field({ nullable: true })
  open_air_id?: string

  // workshop dates will be simplified to search
  // using the format "between 5/12 and 7/18"
  // format as { gte: 5/12}
  @Field({ nullable: true })
  workshop_start_time?: Date

  // format as { lte: 7/18}
  @Field({ nullable: true })
  workshop_end_time?: Date

  @Field({ nullable: true })
  workshop_groups?: number

  @Field({ nullable: true })
  workshop_id?: number

  @Field(() => [SESSION_STATUS], { nullable: true })
  workshop_status: SESSION_STATUS[]
}

export const parseWorkshopWhereArgs = (filters: WorkshopFilterOptions) => {
  return {
    assigned_advisor_id: filters.assigned_advisor_id,
    group_id: filters.group_id,
    client_id: filters.client_id,
    cohort_name: { contains: filters.cohort_name, mode: 'insensitive' },
    deleted: filters.deleted,
    in_person: filters.in_person,
    open_air_id: filters.open_air_id,
    workshop_start_time: { gte: filters.workshop_start_time },
    workshop_end_time: { lte: filters.workshop_end_time },
    workshop_id: filters.workshop_id,
    workshop_status: {
      in: filters.workshop_status, //['REQUESTED', 'VETTING', 'HOLDING']
    },
  }
}
