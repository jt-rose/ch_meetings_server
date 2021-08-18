import 'reflect-metadata'
import { buildSchema } from 'type-graphql'
import { authChecker } from './middleware/authChecker'

/* ---------------------------- import resolvers ---------------------------- */
import { WorkshopSessionResolver } from './graphql/workshops/SessionResolver'
import { ClientResolver } from './graphql/clients/ClientResolver'
import { CourseResolver } from './graphql/courses/CourseResolver'
import { AdvisorResolver } from './graphql/advisors/AdvisorResolver'
import { LanguageResolver } from './graphql/advisors/LanguageResolver'
import { RegionResolver } from './graphql/advisors/AdvisorRegionResolver'
import { AdvisorNoteResolver } from './graphql/advisors/AdvisorNoteResolver'
import { AdvisorUnavailableTimeResolver } from './graphql/advisors/AdvisorUnavailableTimesResolver'
import { CourseworkResolver } from './graphql/courses/CourseworkResolver'
import { ManagerResolver } from './graphql/managers/ManagerResolver'
import { ManagerAssignmentsResolver } from './graphql/managers/ManagerAssignmentResolver'
import { AvailableLicenseResolver } from './graphql/licenses/AvailableLicenseResolver'
import { ReservedLicenseResolver } from './graphql/licenses/ReservedLicenseResolver'
import { WorkshopResolver } from './graphql/workshops/WorkshopResolver'
import { WorkshopGroupResolver } from './graphql/workshops/WorkshopGroupResolver'

/* ---------------------- generates the graphQL schema ---------------------- */
// authChecker is applied as an arg, allowing for DI if needed
// if a mock schema is set up, make sure to set 'emitSDL' to false
// to avoid overwriting the real schema SDL
const generateSchemaType =
  (customAuthChecker: typeof authChecker, emitSDL: boolean) => () =>
    buildSchema({
      resolvers: [
        WorkshopResolver,
        WorkshopSessionResolver,
        WorkshopGroupResolver,
        ClientResolver,
        CourseResolver,
        AdvisorResolver,
        LanguageResolver,
        RegionResolver,
        AdvisorNoteResolver,
        AdvisorUnavailableTimeResolver,
        CourseworkResolver,
        ManagerResolver,
        ManagerAssignmentsResolver,
        AvailableLicenseResolver,
        ReservedLicenseResolver,
      ],
      validate: false,
      // automatically create `schema.gql` file with schema definition in project's working directory
      emitSchemaFile: emitSDL,
      authChecker: customAuthChecker,
    })

// create schema for production
export const createSchema = generateSchemaType(authChecker, true)
