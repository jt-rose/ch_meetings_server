import 'reflect-metadata'
import { buildSchema } from 'type-graphql'
import { authChecker } from './middleware/authChecker'
import { ErrorInterceptor } from './middleware/errorHandler'

/* ---------------------------- import resolvers ---------------------------- */
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
import { LicenseResolver } from './graphql/licenses/LicenseResolver'
import { WorkshopResolver } from './graphql/workshops/WorkshopResolver'
import { WorkshopChangeRequestResolver } from './graphql/workshops/WorkshopChangeRequestResolver'
import { WorkshopGroupResolver } from './graphql/workshops/WorkshopGroupResolver'
import { ErrorLogResolver } from './graphql/error_log/ErrorLogResolver'

/* ---------------------- generates the graphQL schema ---------------------- */
// authChecker is applied as an arg, allowing for DI if needed
// if a mock schema is set up, make sure to set 'emitSDL' to false
// to avoid overwriting the real schema SDL
const generateSchemaType =
  (customAuthChecker: typeof authChecker, emitSDL: boolean) => () =>
    buildSchema({
      resolvers: [
        WorkshopResolver,
        WorkshopChangeRequestResolver,
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
        LicenseResolver,
        ErrorLogResolver,
      ],
      validate: false,
      // automatically create `schema.gql` file with schema definition in project's working directory
      emitSchemaFile: emitSDL,
      authChecker: customAuthChecker,
      globalMiddlewares: [ErrorInterceptor],
    })

// create schema for production
export const createSchema = generateSchemaType(authChecker, true)
