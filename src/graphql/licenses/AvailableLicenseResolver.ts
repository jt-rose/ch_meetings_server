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
}
