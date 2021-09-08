import {
  Resolver,
  FieldResolver,
  Root,
  Query,
  Mutation,
  Ctx,
  Arg,
  Int,
  InputType,
  Field,
} from 'type-graphql'
import { Context } from '../../utils/context'
import { Coursework } from './Coursework'
import { Course } from './Course'
import { CoursesToCoursework } from './CoursesToCoursework'
import { CustomError } from '../../middleware/errorHandler'

// coursework input
@InputType()
class CourseworkInput {
  @Field(() => Int)
  coursework_id: number

  @Field()
  coursework_name: string

  @Field({ nullable: true })
  coursework_description?: string

  @Field()
  active: boolean
}

@Resolver(Coursework)
export class CourseworkResolver {
  @FieldResolver(() => [Course])
  async courses(@Ctx() ctx: Context, @Root() root: Coursework) {
    const courses = await ctx.prisma.coursework
      .findUnique({ where: { coursework_id: root.coursework_id } })
      .courses_and_coursework({ include: { courses: true } })

    return courses.map((x) => x.courses)
  }

  // retrieve all coursework
  @Query(() => [Coursework])
  getAllCoursework(@Ctx() ctx: Context) {
    return ctx.prisma.coursework.findMany()
  }

  // individual will be retrieved on courses/ workshop field resolver

  // add
  @Mutation(() => Coursework)
  addCoursework(
    @Ctx() ctx: Context,
    @Arg('name') name: string,
    @Arg('description', { nullable: true }) description?: string
  ) {
    // a SQL unique constraint is in place, so no need to check for a unique name on the server
    return ctx.prisma.coursework.create({
      data: {
        coursework_name: name,
        coursework_description: description,
        active: true,
        created_by: ctx.req.session.manager_id!,
      },
    })
  }

  // edit
  @Mutation(() => Coursework)
  editCoursework(
    @Ctx() ctx: Context,
    @Arg('courseworkInput') courseworkInput: CourseworkInput
  ) {
    const { coursework_id, coursework_name, coursework_description, active } =
      courseworkInput
    return ctx.prisma.coursework.update({
      where: { coursework_id },
      data: {
        coursework_name,
        coursework_description,
        active,
      },
    })
  }

  // delete
  @Mutation(() => Coursework)
  async removeCoursework(
    @Ctx() ctx: Context,
    @Arg('coursework_id', () => Int) coursework_id: number
  ) {
    try {
      return ctx.prisma.coursework.delete({ where: { coursework_id } })
    } catch (err) {
      const courseworkInUse = await ctx.prisma.coursework.findFirst({
        where: { coursework_id },
        include: { workshop_coursework: true, courses_and_coursework: true },
      })

      if (courseworkInUse?.courses_and_coursework.length) {
        throw new CustomError(
          `This coursework is registered to a course and cannot be deleted. Please unregister it first!`
        )
      }

      if (courseworkInUse?.workshop_coursework.length) {
        throw new CustomError(
          `This coursework has been assigned to a workshop and cannot be deleted without unregistering it from the workshop first!`
        )
      }

      throw err
    }
  }

  // registerAsCourseMaterial
  @Mutation(() => CoursesToCoursework)
  registerAsCourseMaterial(
    @Ctx() ctx: Context,
    @Arg('course_id', () => Int) course_id: number,
    @Arg('coursework_id', () => Int) coursework_id: number
  ) {
    return ctx.prisma.courses_and_coursework.create({
      data: {
        course_id,
        coursework_id,
      },
    })
  }

  // removeAsCourseMaterial
  @Mutation(() => CoursesToCoursework)
  removeFromCourseMaterial(
    @Ctx() ctx: Context,
    @Arg('course_and_coursework_id', () => Int) course_and_coursework_id: number
  ) {
    return ctx.prisma.courses_and_coursework.delete({
      where: { course_and_coursework_id },
    })
  }
}
