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
}

@InputType()
class AddLicenseInput extends LicenseInput {
  @Field(() => Int)
  amount_to_add: number
}

@InputType()
class RemoveLicenseInput extends LicenseInput {
  @Field(() => Int)
  amount_to_remove: number
}

// to keep things simple and intentional
// you will not be able to edit license type
// and will instead need to remove licenses from one and create/ add to a new license
// for editing the license type
// this can, however, be simplified a bit on the front end

// since reserved and used licenses will be managed in conjunction with workshops
// only the available_amount can be edited here

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

  // addLicenses (create new or add to existing)
  @Authenticated()
  @Mutation(() => License)
  async addAvailableLicenses(
    @Ctx() ctx: Context,
    @Arg('licenseInput') licenseInput: AddLicenseInput,
    @Arg('change_note', { nullable: true }) change_note?: string
  ) {
    const { client_id, course_id, amount_to_add, license_type } = licenseInput

    if (amount_to_add <= 0) {
      throw new CustomError('Amount of licenses added must be one or greater')
    }

    // check for client with matching license for same course and license type
    const clientWithLicense = await ctx.prisma.clients.findFirst({
      where: {
        client_id,
      },
      include: {
        licenses: { where: { course_id, license_type } },
      },
    })

    if (!clientWithLicense) {
      throw new CustomError('No such client found!')
    }

    if (!clientWithLicense.active) {
      throw new CustomError('Licenses cannot be added to an inactive client!')
    }
    const matchingLicense = clientWithLicense.licenses[0]
    const note = `${amount_to_add} ${license_type} licenses added${
      change_note && ' with Manager Note: ' + change_note
    }`

    // if matching license found, add available_amount to existing license
    if (matchingLicense) {
      return ctx.prisma.licenses.update({
        where: { license_id: matchingLicense.license_id },
        data: {
          available_amount: matchingLicense.available_amount + amount_to_add,
          last_updated: new Date(),
          license_changes: {
            create: {
              available_amount_change: amount_to_add,
              used_amount_change: 0,
              reserved_amount_change: 0,
              change_note: note,
              created_by: ctx.req.session.manager_id!,
              created_at: new Date(),
            },
          },
        },
      })
    }

    // if no licenses found for this client / course/ license type combination, create new one
    return ctx.prisma.licenses.create({
      data: {
        client_id,
        course_id,
        license_type,
        available_amount: amount_to_add,
        used_amount: 0,
        reserved_amount: 0,
        created_by: ctx.req.session.manager_id!,
        last_updated: new Date(),
        license_changes: {
          create: {
            available_amount_change: amount_to_add,
            used_amount_change: 0,
            reserved_amount_change: 0,
            change_note: note,
            created_by: ctx.req.session.manager_id!,
            created_at: new Date(),
          },
        },
      },
    })
  }

  // remove available licenses
  @Authenticated()
  @Mutation(() => License)
  async removeAvailableLicenses(
    @Ctx() ctx: Context,
    @Arg('licenseInput') licenseInput: RemoveLicenseInput,
    @Arg('change_note', { nullable: true }) change_note?: string
  ) {
    const { client_id, course_id, amount_to_remove, license_type } =
      licenseInput

    if (amount_to_remove <= 0) {
      throw new CustomError('Amount of licenses removed must be one or greater')
    }

    const currentLicenses = await ctx.prisma.licenses.findFirst({
      where: { client_id, course_id, license_type },
    })
    if (!currentLicenses) {
      throw new CustomError('No such licenses found to be removed from!')
    }

    if (amount_to_remove > currentLicenses.available_amount) {
      throw new CustomError(
        'Cannot remove more available licenses than are currently registered'
      )
    }

    return ctx.prisma.licenses.update({
      where: { license_id: currentLicenses.license_id },
      data: {
        available_amount: currentLicenses.available_amount - amount_to_remove,
        last_updated: new Date(),
        license_changes: {
          create: {
            available_amount_change: -amount_to_remove,
            used_amount_change: 0,
            reserved_amount_change: 0,
            created_by: ctx.req.session.manager_id!,
            created_at: new Date(),
            change_note: `${amount_to_remove} licenses removed ${
              change_note && `. Manager Note: ${change_note}`
            }`,
          },
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
      currentLicense.available_amount - conversionAmount
    if (updatedRemainingAmount < 0) {
      throw new CustomError('Not enough licenses to convert this amount!')
    }

    // batch query to remove licenses from original license
    const removeOriginalLicenses = ctx.prisma.licenses.update({
      where: { license_id },
      data: {
        available_amount: updatedRemainingAmount,
        last_updated: new Date(),
        license_changes: {
          create: {
            available_amount_change: -conversionAmount,
            used_amount_change: 0,
            reserved_amount_change: 0,
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
          available_amount: conversionAmount,
          used_amount: 0,
          reserved_amount: 0,
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
              available_amount_change: conversionAmount,
              used_amount_change: 0,
              reserved_amount_change: 0,
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
    // if licenses for that course do not exist, create them with this amount

    // batch query to add licenses to existing license entity
    const addToExistingLicenses = ctx.prisma.licenses.update({
      where: { license_id: targetLicense.license_id },
      data: {
        available_amount: targetLicense.available_amount + conversionAmount,
        license_changes: {
          create: {
            created_by: ctx.req.session.manager_id!,
            created_at: new Date(),
            available_amount_change: conversionAmount,
            used_amount_change: 0,
            reserved_amount_change: 0,
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
