import {
  Resolver,
  FieldResolver,
  Mutation,
  Int,
  Arg,
  Ctx,
  Root,
  InputType,
  UseMiddleware,
  Field,
} from 'type-graphql'
import { License } from '../objects/License'
import { LicenseChange } from '../objects/LicenseChange'
import { Course } from './../objects/Course'
import { Context } from './../../utils/context'
import { Client } from '../objects/Client'
import { isAuth } from '../../middleware/isAuth'

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

  @Mutation(() => License)
  @UseMiddleware(isAuth)
  async editLicenseAmount(
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
    const manager_id = ctx.req.session.manager_id!
    const currentLicense = await ctx.prisma.licenses.findFirst({
      where: { license_id },
      include: { license_changes: true },
    })

    if (!currentLicense) {
      return ctx.prisma.licenses.create({
        data: {
          client_id,
          course_id,
          remaining_amount,
          license_changes: {
            create: {
              manager_id,
              amount_change: remaining_amount,
              updated_amount: remaining_amount,
              workshop_id,
              change_note,
            },
          },
        },
      })
    }

    const amount_change = remaining_amount - currentLicense.remaining_amount
    return ctx.prisma.licenses.update({
      where: { license_id },
      data: {
        remaining_amount,
        license_changes: {
          create: {
            manager_id,
            amount_change,
            updated_amount: remaining_amount,
            workshop_id,
            change_note,
          },
        },
      },
    })
  }
}
