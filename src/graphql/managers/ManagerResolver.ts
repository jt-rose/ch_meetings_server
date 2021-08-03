import {
  Resolver,
  FieldResolver,
  Root,
  Ctx,
  Arg,
  Int,
  Query,
  Mutation,
  InputType,
  Field,
} from 'type-graphql'
import { Context } from '../../utils/context'
import { Manager } from './Manager'
import { Client } from '../clients/Client'
import { ManagerAssignment } from './ManagerAssignment'
import { Workshop } from '../workshops/Workshop'
import { validateEmail, validatePassword } from '../../utils/validateUser'
import { USER_TYPE } from '../enums/USER_TYPE'
import argon2 from 'argon2'
import { sendEmail } from '../../utils/sendEmail'
import { v4 } from 'uuid'
import { Authenticated, AdminOnly } from '../../middleware/authChecker'

const FORGOT_PASSWORD_PREFIX = 'forgot-password:'

@InputType()
class ManagerInput {
  @Field()
  first_name: string

  @Field()
  last_name: string

  @Field()
  email: string

  @Field()
  email_password: string

  @Field(() => USER_TYPE)
  user_type: USER_TYPE
}

@Resolver(Manager)
export class ManagerResolver {
  /* ----------------------------- field resolvers ---------------------------- */
  @FieldResolver(() => [Client])
  clients(@Ctx() ctx: Context, @Root() root: Manager) {
    return ctx.prisma.managers
      .findUnique({ where: { manager_id: root.manager_id } })
      .manager_clients()
  }

  @FieldResolver(() => [ManagerAssignment])
  assignments(@Ctx() ctx: Context, @Root() root: Manager) {
    return ctx.prisma.managers
      .findUnique({ where: { manager_id: root.manager_id } })
      .manager_assignments()
  } // active? - check names on gql object

  @FieldResolver(() => [Workshop])
  async workshops(@Ctx() ctx: Context, @Root() root: Manager) {
    const workshops = await ctx.prisma.managers
      .findUnique({ where: { manager_id: root.manager_id } })
      .manager_assignments({ include: { workshops: true } })
    return workshops.map((x) => x.workshops)
  }

  /* ----------------------------- CRUD operations ---------------------------- */

  // add new manager as normal user, coordinator, or admin
  // only accessible by admins and superadmins
  @AdminOnly()
  @Mutation(() => Manager)
  async addManager(
    @Ctx() ctx: Context,
    @Arg('managerInput', () => ManagerInput) managerInput: ManagerInput
  ) {
    const { first_name, last_name, email, email_password, user_type } =
      managerInput

    if (
      user_type === USER_TYPE.SUPERADMIN &&
      ctx.req.session.role !== 'SUPERADMIN'
    ) {
      throw Error('A super admin can only be created by another super admin!')
    }

    // confirm valid email and password
    if (!validateEmail(email)) {
      throw Error(
        'invalid email submitted - Please confirm the email signature matches the official company email'
      )
    }
    if (!validatePassword(email_password)) {
      throw Error(
        'invalid password - please confirm password is at least 8 characters long, has upper and lowwercase characters, and includes a number and special character'
      )
    }

    // confirm user email not already registered
    const emailAlreadyRegistered = await ctx.prisma.managers.findFirst({
      where: { email },
    })
    if (emailAlreadyRegistered) {
      throw Error(`user with email "${email}" already registered in the system`)
    }

    // encrypt password
    const hashedPassword = await argon2.hash(email_password)

    // store in database and return user
    // new user will be created by current admin,
    // so there is no need to simultaneously log them in
    return ctx.prisma.managers.create({
      data: {
        first_name,
        last_name,
        email,
        email_password: hashedPassword,
        user_type,
      },
    })
  }

  @Authenticated()
  @Query(() => [Manager])
  getAllManagers(@Ctx() ctx: Context) {
    return ctx.prisma.managers.findMany()
  }

  @AdminOnly()
  @Mutation(() => Manager)
  async editManager(
    @Ctx() ctx: Context,
    @Arg('manager_id') manager_id: number,
    @Arg('managerInput', () => ManagerInput) managerInput: ManagerInput
  ) {
    const { first_name, last_name, email, email_password, user_type } =
      managerInput

    if (
      user_type === USER_TYPE.SUPERADMIN &&
      ctx.req.session.role !== 'SUPERADMIN'
    ) {
      throw Error('A super admin can only be edited by another super admin!')
    }
    // confirm valid email and password
    if (!validateEmail(email)) {
      throw Error(
        'invalid email submitted - Please confirm the email signature matches the official company email'
      )
    }
    if (!validatePassword(email_password)) {
      throw Error(
        'invalid password - please confirm password is at least 8 characters long, has upper and lowwercase characters, and includes a number and special character'
      )
    }

    // confirm user email not already registered
    const emailAlreadyRegistered = await ctx.prisma.managers.findFirst({
      where: { email },
    })
    if (emailAlreadyRegistered) {
      throw Error(`user with email "${email}" already registered in the system`)
    }
    // encrypt password
    const hashedPassword = await argon2.hash(email_password)

    // remove stored sessions
    await ctx.redis.flushdb()

    // update and return user
    return ctx.prisma.managers.update({
      where: { manager_id },
      data: {
        first_name,
        last_name,
        email,
        email_password: hashedPassword,
        user_type,
      },
    })
  }

  // managers will be deactivated, rather than deleted completely, in order to preserve records of activity
  @AdminOnly()
  @Mutation(() => Client)
  async changeManagerActiveStatus(
    @Ctx() ctx: Context,
    @Arg('manager_id', () => Int) manager_id: number,
    @Arg('active') active: boolean
  ) {
    // set up update function
    const changeManagerStatus = ctx.prisma.managers.update({
      where: { manager_id },
      data: { active },
    })

    // if manager will switch to inactive
    // deactivate assignments and client relationships first
    if (!active) {
      const removeAssignments = ctx.prisma.manager_assignments.updateMany({
        where: { manager_id },
        data: { active: false },
      })
      const removeClients = ctx.prisma.manager_clients.updateMany({
        where: { manager_id },
        data: { active: false },
      })
      const update = await ctx.prisma.$transaction([
        removeAssignments,
        removeClients,
        changeManagerStatus,
      ])
      return update[2]
    }

    // if client will switch to active, simply run the update
    return changeManagerStatus
  }

  // addProfilePic ?

  /* ----------------------------- authentication ----------------------------- */
  @Mutation(() => Manager)
  async login(
    @Ctx() ctx: Context,
    @Arg('email') email: string,
    @Arg('password') password: string
  ) {
    try {
      const manager = await ctx.prisma.managers.findFirst({ where: { email } })
      if (!manager) {
        throw Error('incorrect username/password')
      }

      const validPassword = await argon2.verify(
        manager.email_password,
        password
      )
      if (!validPassword) {
        throw Error('incorrect username/password')
      }
      ctx.req.session.manager_id = manager.manager_id
      ctx.req.session.role = manager.user_type

      return manager
    } catch (err) {
      return err
    }
  }

  @Mutation(() => Boolean)
  logout(@Ctx() ctx: Context) {
    return new Promise((resolve) =>
      ctx.req.session.destroy((err: any) => {
        ctx.res.clearCookie(process.env.COOKIE_SECRET as string)
        if (err) {
          console.log(err)
          resolve(false)
          return
        }

        resolve(true)
      })
    )
  }

  @Query(() => Manager, { nullable: true })
  fetchManager(@Ctx() ctx: Context) {
    const { manager_id } = ctx.req.session
    // if not logged in
    if (!manager_id) return null

    return ctx.prisma.managers.findFirst({ where: { manager_id } })
  }

  // change own password when logged in
  @Authenticated()
  @Mutation(() => Manager)
  async changeMyPassword(
    @Ctx() ctx: Context,
    @Arg('newPassword') newPassword: string
  ) {
    if (!validatePassword(newPassword)) {
      throw Error(
        'invalid password - please confirm password is at least 8 characters long, has upper and lowwercase characters, and includes a number and special character'
      )
    }
    const newPasswordHash = await argon2.hash(newPassword)
    return ctx.prisma.managers.update({
      where: { manager_id: ctx.req.session.manager_id },
      data: { email_password: newPasswordHash },
    })
  }

  // admin - change password of any user, coordinator, or admin
  @AdminOnly()
  @Mutation(() => Manager)
  async changePasswordAdminAccess(
    @Ctx() ctx: Context,
    @Arg('manager_id', () => Int) manager_id: number,
    @Arg('newPassword') newPassword: string
  ) {
    if (!validatePassword(newPassword)) {
      throw Error(
        'invalid password - please confirm password is at least 8 characters long, has upper and lowwercase characters, and includes a number and special character'
      )
    }

    const hashedPassword = await argon2.hash(newPassword)
    // clear redis cache for managers
    await ctx.redis.flushdb()

    return ctx.prisma.managers.update({
      where: { manager_id },
      data: { email_password: hashedPassword },
    })
  }

  // create unique password reset link and send it to user via email
  @Mutation(() => Boolean)
  async forgotPassword(@Ctx() ctx: Context, @Arg('email') email: string) {
    const manager = await ctx.prisma.managers.findFirst({ where: { email } })
    if (!manager) {
      throw Error(`no such manager with email "${email}" found`)
    }

    const token = v4()
    console.log('key: ' + FORGOT_PASSWORD_PREFIX + token)
    await ctx.redis.set(
      FORGOT_PASSWORD_PREFIX + token,
      manager.manager_id,
      'ex',
      1000 * 60 * 60 // one hour
    )
    // add prod origin when ready
    const resetURL = process.env.RESET_PASSWORD_URL || 'http://localhost:3000'
    const resetLink = `<a href="${resetURL}/change-password/${token}">reset password</a>`
    await sendEmail(email, resetLink).catch((err) => console.error(err))

    return true
  }

  @Mutation(() => Manager)
  async resetPassword(
    @Ctx() ctx: Context,
    @Arg('token') token: string,
    @Arg('newPassword') newPassword: string
  ) {
    // validate new password
    if (!validatePassword(newPassword)) {
      throw Error(
        'invalid password - please confirm password is at least 8 characters long, has upper and lowwercase characters, and includes a number and special character'
      )
    }
    const key = FORGOT_PASSWORD_PREFIX + token
    console.log('key: ' + key)
    const redisId = await ctx.redis.get(key)
    if (!redisId) {
      throw Error('Error: token expired')
    }

    const manager_id = parseInt(redisId)
    const manager = await ctx.prisma.managers.findFirst({
      where: { manager_id },
    })
    if (!manager) {
      throw Error('Error: manager no longer registered in system')
    }

    const hashedPassword = await argon2.hash(newPassword)

    const updatedManager = await ctx.prisma.managers.update({
      where: { manager_id },
      data: { email_password: hashedPassword },
    })

    // delete redis change-password session
    await ctx.redis.del(key)

    // login after changing password
    ctx.req.session.manager_id = manager_id

    return updatedManager
  }
}
