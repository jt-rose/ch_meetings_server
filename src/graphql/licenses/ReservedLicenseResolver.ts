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
import { CustomError } from '../../middleware/errorHandler'

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

  // when a workshop license rather than an individual license is used
  // the reserved and final amount should always be one
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
    if (!reservedLicense) {
      throw new CustomError('No such reserved licenses found!')
    }

    if (
      reservedLicense.available_licenses.license_type === 'FULL_WORKSHOP' &&
      reservedLicense.reserved_amount !== 1
    ) {
      // this error would be most likely caused by a mismatch of the front-end/ backend and will be hidden from users
      throw new Error(
        `a reserved license amount of ${final_amount_used} was requested for a full_workshop license reservation. A full workshop license covers all participants in a workshop, and therefore there should only be one of this type of license reserved per workshop.`
      )
    }
    // check for difference in final amounts used
    const finalAmountChange =
      final_amount_used - reservedLicense.reserved_amount
    const updatedAvailableLicenseAmount =
      reservedLicense.available_licenses.remaining_amount - finalAmountChange

    // if higher number of licenses used then originally reserved, confirm enough available
    if (updatedAvailableLicenseAmount < 0) {
      throw new CustomError(
        'Not enough available licenses to cover the increase reserved licenses amount requested!'
      )
    }

    // if difference found, adjust available licenses when resolving the reservation

    const change_note =
      reservedLicense.available_licenses.license_type === 'FULL_WORKSHOP'
        ? 'Reserved full workshop license resolved'
        : `Reserved Licenses (ID: ${reserved_license_id}) resolved with a final amount used of ${final_amount_used}. ${
            finalAmountChange !== 0 &&
            `Difference of ${finalAmountChange} from original reservation was found and amount of available licenses remaining was adjusted to ${updatedAvailableLicenseAmount}`
          }`

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
            reserved_license_id,
            change_note,
          },
        },
      },
    })
  }
}
