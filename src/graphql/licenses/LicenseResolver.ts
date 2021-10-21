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
import { License } from './License'
import { LicenseChange } from './LicenseChange'
import { Course } from '../courses/Course'
import { Context } from '../../utils/context'
import { Client } from '../clients/Client'
import { Authenticated } from '../../middleware/authChecker'
import { CustomError } from '../../middleware/errorHandler'
import { LICENSE_TYPE } from '../enums/LICENSE_TYPE'

@InputType()
class LicenseInput {
  @Field(() => Int)
  client_id: number

  @Field(() => Int)
  course_id: number

  @Field(() => LICENSE_TYPE)
  license_type: LICENSE_TYPE

  @Field(() => Int)
  license_amount: number
}

// to keep things simple and intentional
// you will not be able to edit license type
// and will instead need to remove licenses from one and create/ add to a new license
// for editing the license type

@Resolver(License)
export class LicenseResolver {
  /* ----------------------------- field resolvers ---------------------------- */

  @FieldResolver(() => Course)
  course(@Ctx() ctx: Context, @Root() root: License) {
    return ctx.prisma.licenses
      .findUnique({ where: { license_id: root.license_id } })
      .courses()
  }

  @FieldResolver(() => Client)
  client(@Ctx() ctx: Context, @Root() root: License) {
    return ctx.prisma.licenses
      .findUnique({ where: { license_id: root.license_id } })
      .clients()
  }

  @FieldResolver(() => [LicenseChange])
  license_changes(@Ctx() ctx: Context, @Root() root: License) {
    return ctx.prisma.licenses
      .findUnique({ where: { license_id: root.license_id } })
      .license_changes()
  }

  /* ----------------------------- CRUD operations ---------------------------- */

  // read function will be managed via field resolver on clients
  // records will be kept for all license creations and changes, so no delete function needed

  // create or change license amounts
  @Authenticated()
  @Mutation(() => License)
  async changeLicenseAmounts(
    @Ctx() ctx: Context,
    @Arg('licenseInput') licenseInput: LicenseInput,
    @Arg('change_note', { nullable: true }) change_note?: string
  ) {
    const { client_id, course_id, license_amount, license_type } = licenseInput

    // reject if license amount is below 0
    if (license_amount < 0) {
      throw new CustomError('Amount of licenses cannot be negative!')
    }

    // check for client with current license present
    const clientWithLicense = await ctx.prisma.clients.findFirst({
      where: { client_id },
      include: {
        workshops: {
          where: { license_type, workshop_status: { not: 'CANCELLED' } },
        },
        licenses: { where: { course_id, license_type } },
      },
    })

    if (!clientWithLicense) {
      throw new CustomError('No such client found!')
    }

    const currentLicense = clientWithLicense.licenses[0]
    // if no current license present, create a new license with the license amount
    if (!currentLicense) {
      return ctx.prisma.licenses.create({
        data: {
          license_amount,
          client_id,
          course_id,
          license_type,
          created_by: ctx.req.session.manager_id!,
          created_at: new Date(),
          last_updated: new Date(),
          license_changes: {
            create: [
              {
                updated_license_amount: license_amount,
                change_note: `${license_amount} ${license_type} licenses added${
                  change_note && ' with Manager Note: ' + change_note
                }`,
                created_by: ctx.req.session.manager_id!,
                created_at: new Date(),
              },
            ],
          },
        },
      })
    }

    // if license present, confirm updated amount will be sufficient
    // to account for scheduled and completed workshops
    const reservedLicenseAmount =
      license_type === 'FULL_WORKSHOP'
        ? clientWithLicense.workshops.length
        : clientWithLicense.workshops.reduce(
            (total, workshop) => total + workshop.class_size,
            0
          )

    if (reservedLicenseAmount > license_amount) {
      throw new CustomError(
        `A minimum of ${reservedLicenseAmount} licenses are required to cover workshops since the start of the program. Reducing the license count to ${license_amount} would leave insufficient licenses to cover completed and scheduled workshops.`
      )
    }

    // update license amount
    return ctx.prisma.licenses.update({
      where: { license_id: currentLicense.license_id },
      data: {
        license_amount,
        last_updated: new Date(),
        license_changes: {
          create: [
            {
              updated_license_amount: license_amount,
              change_note: `${license_type} license count adjusted to ${license_amount} licenses${
                change_note && ' with Manager Note: ' + change_note
              }`,
              created_by: ctx.req.session.manager_id!,
              created_at: new Date(),
            },
          ],
        },
      },
    })
  }

  // convert client's licenses from one course to another
  // does not change license type
  @Authenticated()
  @Mutation(() => [License])
  async convertLicenses(
    @Ctx() ctx: Context,
    @Arg('license_id', () => Int) license_id: number,
    @Arg('targetCourse', () => Int) targetCourse: number,
    @Arg('conversionAmount', () => Int) conversionAmount: number
  ) {
    // check for course licenses to convert between
    const checkForLicenses = await ctx.prisma.licenses.findMany({
      where: { OR: [{ license_id }, { course_id: targetCourse }] },
    })

    // reject if no license found to remove licenses from
    const currentLicense = checkForLicenses.find(
      (license) => license.license_id === license_id
    )
    if (!currentLicense) {
      throw new CustomError('No such license exists!')
    }

    // confirm license count will not drop below 0 upon change
    const updatedRemainingAmount =
      currentLicense.license_amount - conversionAmount
    if (updatedRemainingAmount < 0) {
      throw new CustomError('Not enough licenses to convert this amount!')
    }

    // batch query to remove licenses from original license
    const removeOriginalLicenses = ctx.prisma.licenses.update({
      where: { license_id },
      data: {
        license_amount: updatedRemainingAmount,
        last_updated: new Date(),
        license_changes: {
          create: [
            {
              updated_license_amount: updatedRemainingAmount,
              change_note: `${conversionAmount} licenses converted to course #${targetCourse}`,
              created_by: ctx.req.session.manager_id!,
              created_at: new Date(),
            },
          ],
        },
      },
    })

    // check for course licenses that will have licenses moved into
    const targetLicense = checkForLicenses.find(
      (license) =>
        license.course_id === targetCourse &&
        license.client_id === currentLicense.client_id &&
        license.license_type === currentLicense.license_type
    )

    // if no target license already exists, remove original licenses and create target licenses
    if (!targetLicense) {
      // confirm target course exists
      const targetCourseExists = await ctx.prisma.courses.findFirst({
        where: { course_id: targetCourse },
      })
      if (!targetCourseExists) {
        throw new CustomError('No such course exists to move licenses into!')
      }

      // batch query to add licenses to a new license entity
      const createNewLicenses = ctx.prisma.licenses.create({
        data: {
          license_amount: conversionAmount,
          course_id: targetCourse,
          client_id: currentLicense.client_id,
          created_by: ctx.req.session.manager_id!,
          created_at: new Date(),
          license_type: currentLicense.license_type,
          last_updated: new Date(),

          license_changes: {
            create: {
              created_by: ctx.req.session.manager_id!,
              created_at: new Date(),
              updated_license_amount: conversionAmount,
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

    // if target license exists, confirm the course type
    // reject if it is the same course
    // remove original licenses and update the target license amount

    // reject if current license and target license are the same
    if (targetLicense.license_id === license_id) {
      throw new CustomError(
        'Cannot convert licenses from and to the same course!'
      )
    }

    // remove licenses from original course license and add to license amount for a different course

    // batch query to add licenses to existing license entity
    const addToExistingLicenses = ctx.prisma.licenses.update({
      where: { license_id: targetLicense.license_id },
      data: {
        license_amount: targetLicense.license_amount + conversionAmount,
        license_changes: {
          create: {
            created_by: ctx.req.session.manager_id!,
            created_at: new Date(),
            updated_license_amount:
              targetLicense.license_amount + conversionAmount,
            change_note: `${conversionAmount} licenses converted from license #${license_id} to new licenses for course #${targetCourse}`,
          },
        },
      },
    })

    // run both queries in a transaction
    return ctx.prisma.$transaction([
      removeOriginalLicenses,
      addToExistingLicenses,
    ])
  }
}
