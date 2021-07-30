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
  @Field(() => Int, { nullable: true })
  license_id?: number

  @Field(() => Int)
  client_id: number

  @Field(() => Int)
  course_id: number

  @Field(() => Int)
  remaining_amount: number

  @Field()
  change_note: string

  @Field(() => Int, { nullable: true })
  workshop_id?: number
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

  // add or edit a license amount
  // NOTE: adjusting the amount due to reserved licenses being used
  // should be handled by the ReservedLicenses resolver
  // this will instead be for adding new licenses and correcting clerical issues
  @Authenticated()
  @Mutation(() => AvailableLicense)
  async upsertLicenses(
    @Ctx() ctx: Context,
    @Arg('licenseInput') licenseInput: LicenseInput
  ) {
    const {
      license_id,
      client_id,
      course_id,
      remaining_amount,
      change_note,
      workshop_id,
    } = licenseInput

    // if no license provided, create a new license set
    if (!license_id) {
      return ctx.prisma.available_licenses.create({
        data: {
          client_id,
          course_id,
          remaining_amount,
          last_updated: new Date(),
          created_by: ctx.req.session.manager_id!,
          license_changes: {
            create: {
              amount_change: remaining_amount,
              updated_amount: remaining_amount,
              workshop_id,
              change_note,
              created_by: ctx.req.session.manager_id!,
            },
          },
        },
      })
    }

    // if license_id provided, confirm in database
    const currentLicense = await ctx.prisma.available_licenses.findFirst({
      where: { license_id },
      include: { license_changes: true },
    })

    if (!currentLicense) {
      throw Error('no such license found!')
    }

    // update license amount
    const amount_change = remaining_amount - currentLicense.remaining_amount
    return ctx.prisma.available_licenses.update({
      where: { license_id },
      data: {
        remaining_amount,
        license_changes: {
          create: {
            created_by: ctx.req.session.manager_id!,
            amount_change,
            updated_amount: remaining_amount,
            workshop_id,
            change_note,
          },
        },
      },
    })
  }

  // check if license type already exists and add to it if so
  // reserveLicenses
  // editReservedLicenses
  // removeReservedLicenses - actually, no, save for record
}

@Resolver(ReservedLicense)
export class ReservedLicenseResolver {
  /* ----------------------------- field resolvers ---------------------------- */

  /* ----------------------------- CRUD operations ---------------------------- */
  reserveLicenses() {}
  editReservedLicenses() {}
}