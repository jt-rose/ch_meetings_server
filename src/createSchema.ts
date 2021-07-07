import 'reflect-metadata'
import { buildSchema } from 'type-graphql'
import { authChecker } from './middleware/authChecker'

/* ---------------------------- import resolvers ---------------------------- */
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

// generates the graphQL schema
// authChecker is applied as an arg, allowing for DI if needed
// if a mock schema is set up, make sure to set 'emitSDL' to false
// to avoid overwriting the real schema SDL
const generateSchemaType =
  (customAuthChecker: typeof authChecker, emitSDL: boolean) => () =>
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
      emitSchemaFile: emitSDL,
      authChecker: customAuthChecker,
    })

// create schema for production
export const createSchema = generateSchemaType(authChecker, true)
