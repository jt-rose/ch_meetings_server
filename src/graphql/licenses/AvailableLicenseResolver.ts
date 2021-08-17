import {
  Resolver,
  FieldResolver,
  Mutation,
  Int,
  Arg,
  Ctx,
  Root,
  InputType,
  Field,
} from 'type-graphql'
import { AvailableLicense } from './AvailableLicense'
import { LicenseChange } from './LicenseChange'
import { Course } from '../courses/Course'
import { Context } from '../../utils/context'
import { Client } from '../clients/Client'
import { Authenticated } from '../../middleware/authChecker'
import { ReservedLicense } from './ReservedLicenses'

@InputType()
class LicenseInput {
  @Field(() => Int)
  client_id: number

  @Field(() => Int)
  course_id: number

  @Field(() => Int)
  remaining_amount: number
}

@InputType()
class EditLicenseInput {
  @Field(() => Int)
  license_id: number

  @Field(() => Int)
  remaining_amount: number

  @Field()
  change_note: string
}

@Resolver(AvailableLicense)
export class AvailableLicenseResolver {
  /* ----------------------------- field resolvers ---------------------------- */

  @FieldResolver(() => Course)
  course(@Ctx() ctx: Context, @Root() root: AvailableLicense) {
    return ctx.prisma.available_licenses
      .findUnique({ where: { license_id: root.license_id } })
      .courses()
  }

  @FieldResolver(() => Client)
  client(@Ctx() ctx: Context, @Root() root: AvailableLicense) {
    return ctx.prisma.available_licenses
      .findUnique({ where: { license_id: root.license_id } })
      .clients()
  }

  @FieldResolver(() => [ReservedLicense])
  reservedLicenses(@Ctx() ctx: Context, @Root() root: AvailableLicense) {
    return ctx.prisma.available_licenses
      .findUnique({ where: { license_id: root.license_id } })
      .reserved_licenses()
  }

  @FieldResolver(() => [LicenseChange])
  license_changes(@Ctx() ctx: Context, @Root() root: AvailableLicense) {
    return ctx.prisma.available_licenses
      .findUnique({ where: { license_id: root.license_id } })
      .license_changes()
  }

  /* ----------------------------- CRUD operations ---------------------------- */

  // read function will be managed via field resolver on clients
  // records will be kept for all license creations and changes, so no delete function needed

  @Authenticated()
  @Mutation(() => AvailableLicense)
  async addLicenses(
    @Ctx() ctx: Context,
    @Arg('licenseInput') licenseInput: LicenseInput
  ) {
    const { client_id, course_id, remaining_amount } = licenseInput

    // check if client already has licenses for this course type, and reject if so

    const courseLicensesAlreadyExist =
      await ctx.prisma.available_licenses.findFirst({
        where: { client_id, course_id },
      })
    if (courseLicensesAlreadyExist) {
      throw Error('Requested course licenses for this client already exist!')
    }
    return ctx.prisma.available_licenses.create({
      data: {
        client_id,
        course_id,
        remaining_amount,
        last_updated: new Date(),
        created_by: ctx.req.session.manager_id!,
        created_at: new Date(),
        license_changes: {
          create: {
            amount_change: remaining_amount,
            updated_amount: remaining_amount,
            change_note: `${remaining_amount} licenses for course #${course_id} added for client id ${client_id}`,
            created_by: ctx.req.session.manager_id!,
            created_at: new Date(),
          },
        },
      },
    })
  }

  // NOTE: adjusting the amount due to reserved licenses being used
  // should be handled by the ReservedLicenses resolver
  // this will instead be for adding new licenses and correcting clerical issues
  @Authenticated()
  @Mutation(() => AvailableLicense)
  async editAvailableLicenses(
    @Ctx() ctx: Context,
    @Arg('licenseInput') licenseInput: EditLicenseInput
  ) {
    const { license_id, remaining_amount, change_note } = licenseInput

    // reject if new remaining amount is less than 0
    if (remaining_amount < 0)
      throw Error('Available license amount cannot be negative!')

    // confirm license exists in database
    const currentLicense = await ctx.prisma.available_licenses.findFirst({
      where: { license_id },
      include: { license_changes: true },
    })

    if (!currentLicense) {
      throw Error('no such license found!')
    }

    // calculate how much the available license amount is changing by
    const amount_change = remaining_amount - currentLicense.remaining_amount

    // update license amount
    return ctx.prisma.available_licenses.update({
      where: { license_id },
      data: {
        remaining_amount,
        license_changes: {
          create: {
            created_by: ctx.req.session.manager_id!,
            amount_change,
            updated_amount: remaining_amount,
            change_note,
          },
        },
      },
    })
  }

  // convert client's licenses from one course to another
  @Authenticated()
  @Mutation(() => [AvailableLicense])
  async convertAvailableLicenses(
    @Ctx() ctx: Context,
    @Arg('license_id', () => Int) license_id: number,
    @Arg('targetCourse', () => Int) targetCourse: number,
    @Arg('conversionAmount', () => Int) conversionAmount: number
  ) {
    // check for course licenses to convert between
    const checkForLicenses = await ctx.prisma.available_licenses.findMany({
      where: { OR: [{ license_id }, { course_id: targetCourse }] },
    })

    // reject if no license found to remove licenses from
    const currentLicense = checkForLicenses.find(
      (license) => license.license_id === license_id
    )
    if (!currentLicense) {
      throw Error('No such license exists!')
    }

    // confirm license count will not drop below 0 upon change
    const updatedRemainingAmount =
      currentLicense.remaining_amount - conversionAmount
    if (updatedRemainingAmount < 0) {
      throw Error('Not enough licenses to convert this amount!')
    }

    //

    // batch query to remove licenses from original license
    const removeOriginalLicenses = ctx.prisma.available_licenses.update({
      where: { license_id },
      data: {
        remaining_amount: updatedRemainingAmount,
        last_updated: new Date(),
        license_changes: {
          create: {
            amount_change: -conversionAmount,
            updated_amount: updatedRemainingAmount,
            change_note: `${conversionAmount} licenses converted to course #${targetCourse}`,
            created_by: ctx.req.session.manager_id!,
            created_at: new Date(),
          },
        },
      },
    })

    // check for course licenses that will have licenses moved into
    const targetLicense = checkForLicenses.find(
      (license) =>
        license.course_id === targetCourse &&
        license.client_id === currentLicense.client_id
    )

    // if no target license already exists, remove original licenses and create target licenses
    if (!targetLicense) {
      // confirm target course exists
      const targetCourseExists = await ctx.prisma.courses.findFirst({
        where: { course_id: targetCourse },
      })
      if (!targetCourseExists) {
        throw Error('No such course exists to move licenses into!')
      }

      // batch query to add licenses toa  new license entity
      const createNewLicenses = ctx.prisma.available_licenses.create({
        data: {
          remaining_amount: conversionAmount,
          course_id: targetCourse,
          client_id: currentLicense.client_id,
          created_by: ctx.req.session.manager_id!,
          created_at: new Date(),
          last_updated: new Date(),

          license_changes: {
            create: {
              created_by: ctx.req.session.manager_id!,
              created_at: new Date(),
              amount_change: conversionAmount,
              updated_amount: conversionAmount,
              change_note: `${conversionAmount} licenses converted from license #${license_id} to new licenses for course #${targetCourse}`,
            },
          },
        },
      })

      // run queries in a transaction
      return ctx.prisma.$transaction([
        removeOriginalLicenses,
        createNewLicenses,
      ])
    }

    // if target license exists, confirm the the course type
    // reject if it is the same course
    // remove original licenses and update the target license amount

    // reject if current license and target license are the same
    if (targetLicense.license_id === license_id) {
      throw Error('Cannot convert licenses from and to the same course!')
    }

    // remove licenses from original course license and add to license amount for a different course
    // if licenses for that course do not exist, create them with this amount

    // batch query to add licenses to existing license entity
    const addToExistingLicenses = ctx.prisma.available_licenses.update({
      where: { license_id: targetLicense.license_id },
      data: {
        remaining_amount: targetLicense.remaining_amount + conversionAmount,
        license_changes: {
          create: {
            created_by: ctx.req.session.manager_id!,
            created_at: new Date(),
            amount_change: conversionAmount,
            updated_amount: conversionAmount,
            change_note: `${conversionAmount} licenses converted from license #${license_id} to new licenses for course #${targetCourse}`,
          },
        },
      },
    })

    // run both queries ina  transaction
    return ctx.prisma.$transaction([
      removeOriginalLicenses,
      addToExistingLicenses,
    ])
  }
}
