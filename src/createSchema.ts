import { buildSchema } from 'type-graphql'
import { WorkshopSessionResolver } from './graphql/resolvers/SessionResolver'
import { ClientResolver } from './graphql/resolvers/ClientResolver'
import { CourseResolver } from './graphql/resolvers/CourseResolver'
import { AdvisorResolver } from './graphql/resolvers/AdvisorResolver'
import { LanguageResolver } from './graphql/resolvers/LanguageResolver'
import { RegionResolver } from './graphql/resolvers/AdvisorRegionResolver'
import { AdvisorNoteResolver } from './graphql/resolvers/AdvisorNoteResolver'
import { UnavailableDayResolver } from './graphql/resolvers/AdvisorUnavailableDayResolver'
import { CourseworkResolver } from './graphql/resolvers/CourseworkResolver'
import { ManagerResolver } from './graphql/resolvers/ManagerResolver'
import { ManagerAssignmentsResolver } from './graphql/resolvers/ManagerAssignmentResolver'
import { LicenseResolver } from './graphql/resolvers/LicenseResolver'

export const createSchema = () =>
  buildSchema({
    resolvers: [
      WorkshopSessionResolver,
      ClientResolver,
      CourseResolver,
      AdvisorResolver,
      LanguageResolver,
      RegionResolver,
      AdvisorNoteResolver,
      UnavailableDayResolver,
      CourseworkResolver,
      ManagerResolver,
      ManagerAssignmentsResolver,
      LicenseResolver,
    ],
    validate: false,
    // automatically create `schema.gql` file with schema definition in project's working directory
    emitSchemaFile: true,
  })
