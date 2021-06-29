// include license changes
import {
  Resolver,
  FieldResolver,
  Query,
  Mutation,
  Int,
  Arg,
  Ctx,
  Root,
} from 'type-graphql'
import { License } from '../objects/License'
import { LicenseChange } from '../objects/LicenseChange'
import { Course } from './../objects/Course'
import { Context } from './../../utils/context'
import { Client } from '../objects/Client'

@Resolver()
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
}
