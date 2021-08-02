import {
  Resolver,
  FieldResolver,
  Mutation,
  Int,
  Arg,
  Ctx,
  Root,
  Field,
} from 'type-graphql'
import { AvailableLicense } from './AvailableLicense'
import { Context } from '../../utils/context'
import { Workshop } from '../workshops/Workshop'
import { Authenticated } from '../../middleware/authChecker'
import { ReservedLicense } from './ReservedLicenses'

@Resolver(ReservedLicense)
export class ReservedLicenseResolver {
  //field resolvers
  @FieldResolver(() => AvailableLicense)
  available_licenses(@Ctx() ctx: Context, @Root() root: ReservedLicense) {
    return ctx.prisma.reserved_licenses
      .findUnique({ where: { reserved_license_id: root.reserved_license_id } })
      .available_licenses()
  }

  @Field(() => Workshop)
  workshop(@Ctx() ctx: Context, @Root() root: ReservedLicense) {
    return ctx.prisma.reserved_licenses
      .findUnique({ where: { reserved_license_id: root.reserved_license_id } })
      .workshops()
  }

  // reserved licenses will be managed through workshop requests
  // so the below functions will not be needed
  // as it is important to have these paired with workshop requests
  /*
  // CRUD Uperations
  @Authenticated()
  @Mutation(() => AvailableLicense)
  async reserveLicenses(
    @Ctx() ctx: Context,
    @Arg('license_id', () => Int) license_id: number,
    @Arg('reserved_amount', () => Int) reserved_amount: number,
    @Arg('workshop_id', () => Int) workshop_id: number
  ) {
    // check for current number of licenses
    const currentLicenseCount = await ctx.prisma.available_licenses.findFirst({
      where: { license_id },
    })
    // reject if licenses not found under this license id
    if (!currentLicenseCount) throw Error('No such licenses found!')
    // get the updated amount of available licenses and reject if it is less than 0
    const updatedAvailableLicensesAmount =
      currentLicenseCount.remaining_amount - reserved_amount
    if (updatedAvailableLicensesAmount < 0)
      throw Error(
        `Not enough licenses! This client only has ${currentLicenseCount.remaining_amount} of these licenses left but you requested ${reserved_amount} licenses`
      )

    return ctx.prisma.available_licenses.update({
      where: { license_id },
      data: {
        remaining_amount: updatedAvailableLicensesAmount,
        reserved_licenses: {
          create: {
            created_by: ctx.req.session.manager_id!,
            created_at: new Date(),
            last_updated: new Date(),
            reserved_amount,
            reserved_status: 'RESERVED',
            workshop_id,
          },
        },
        license_changes: {
          create: {
            created_by: ctx.req.session.manager_id!,
            created_at: new Date(),
            amount_change: -reserved_amount,
            updated_amount: updatedAvailableLicensesAmount,
            workshop_id,
            change_note: `${reserved_amount} of licenses reserved for workshops #${workshop_id}`,
          },
        },
      },
    })
  }

  @Authenticated()
  @Mutation(() => AvailableLicense)
  async adjustReservedLicenseAmount(
    @Ctx() ctx: Context,
    @Arg('reserved_license_id', () => Int) reserved_license_id: number,
    @Arg('amount_change', () => Int) amount_change: number,
    @Arg('change_note', { nullable: true }) change_note?: string
  ) {
    if (amount_change === 0)
      throw Error('Please select an amount to change the reserved licenses by')
    // if reserved amount increases, confirm enough available licenses
    const currentReservedLicenses =
      await ctx.prisma.reserved_licenses.findFirst({
        where: { reserved_license_id },
        include: { available_licenses: true },
      })
    if (!currentReservedLicenses) throw Error('No such licenses found!')

    const updatedAvailableLicensesAmount =
      currentReservedLicenses.available_licenses.remaining_amount -
      amount_change
    if (amount_change > 0 && updatedAvailableLicensesAmount < 0) {
      throw Error(
        `Not enough licenses! This client only has ${currentReservedLicenses.available_licenses.remaining_amount} of these licenses left but you requested an additional ${amount_change} licenses`
      )
    }
    const updatedReservedAMount =
      currentReservedLicenses.reserved_amount + amount_change

    // adjust available and reserved licenses amounts and create change note
    return ctx.prisma.available_licenses.update({
      where: { license_id: currentReservedLicenses.license_id },
      data: {
        remaining_amount: updatedAvailableLicensesAmount,
        reserved_licenses: {
          update: {
            where: { reserved_license_id },
            data: {
              reserved_amount: updatedReservedAMount,
              last_updated: new Date(),
            },
          },
        },
        license_changes: {
          create: {
            created_by: ctx.req.session.manager_id!,
            created_at: new Date(),
            amount_change,
            updated_amount: updatedAvailableLicensesAmount,
            change_note: `Reserved amount ${
              amount_change > 0 ? 'increased' : 'decreased'
            } by ${amount_change}.${
              change_note && ' Manager Note: ' + change_note
            }`,
          },
        },
      },
    })
  }

  @Authenticated()
  @Mutation(() => AvailableLicense)
  async removeReservedLicenses(
    @Ctx() ctx: Context,
    @Arg('reserved_license_id', () => Int) reserved_license_id: number
  ) {
    // get available_license_id
    const reservedLicense = await ctx.prisma.reserved_licenses.findFirst({
      where: { reserved_license_id },
      include: { available_licenses: true },
    })
    if (!reservedLicense) throw Error('No such reserved licenses found!')
    const updated_amount =
      reservedLicense.available_licenses.remaining_amount +
      reservedLicense.reserved_amount

    return ctx.prisma.available_licenses.update({
      where: { license_id: reservedLicense.license_id },
      data: {
        remaining_amount: updated_amount,
        last_updated: new Date(),
        reserved_licenses: { delete: { reserved_license_id } },
        license_changes: {
          create: {
            created_by: ctx.req.session.manager_id!,
            created_at: new Date(),
            amount_change: reservedLicense.reserved_amount,
            updated_amount,
            change_note: `reserved licenses #${reserved_license_id} removed and ${reservedLicense.reserved_amount} licenses added back to available licenses`,
          },
        },
      },
    })
  }
  */

  @Authenticated()
  @Mutation(() => AvailableLicense)
  async confirmReservedLicensesUsed(
    @Ctx() ctx: Context,
    @Arg('reserved_license_id', () => Int) reserved_license_id: number,
    @Arg('final_amount_used', () => Int) final_amount_used: number
  ) {
    // get reserved license, available license id, and check for difference in final amount used
    const reservedLicense = await ctx.prisma.reserved_licenses.findFirst({
      where: { reserved_license_id },
      include: { available_licenses: true },
    })
    if (!reservedLicense) throw Error('No such reserved licenses found!')

    // check for difference in final amounts used
    const finalAmountChange =
      final_amount_used - reservedLicense.reserved_amount
    const updatedAvailableLicenseAmount =
      reservedLicense.available_licenses.remaining_amount - finalAmountChange

    // if higher number of licenses used then originally reserved, confirm enough available
    if (updatedAvailableLicenseAmount < 0) {
      throw Error(
        'Not enough available licenses to cover the increase reserved licenses amount requested!'
      )
    }

    // if difference found, adjust available licenses when resolving the reservation

    return ctx.prisma.available_licenses.update({
      where: { license_id: reservedLicense.license_id },
      data: {
        remaining_amount: updatedAvailableLicenseAmount,
        reserved_licenses: {
          update: {
            where: { reserved_license_id },
            data: {
              reserved_status: 'FINALIZED',
              reserved_amount: final_amount_used,
              last_updated: new Date(),
            },
          },
        },
        license_changes: {
          create: {
            created_by: ctx.req.session.manager_id!,
            created_at: new Date(),
            amount_change: finalAmountChange,
            updated_amount: updatedAvailableLicenseAmount,
            change_note: `Reserved Licenses (ID: ${reserved_license_id}) resolved with a final amount used of ${final_amount_used}. ${
              finalAmountChange !== 0 &&
              `Difference of ${finalAmountChange} from original reservation was found and amount of available licenses remaining was adjusted to ${updatedAvailableLicenseAmount}`
            }`,
          },
        },
      },
    })
  }
}
