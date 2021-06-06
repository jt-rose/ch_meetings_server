import { Resolver, Query, Mutation, Arg, Ctx, Int } from 'type-graphql'
import { Context } from '../../utils/context'
import { Course, CourseInput } from '../objects/Course'

@Resolver(Course)
export class CourseResolver {
  // confirm nullable returns?

  // getCourse
  @Query(() => Course, { nullable: true })
  async getCourse(
    @Ctx() ctx: Context,
    @Arg('course_id', () => Int) course_id: number
  ) {
    // use await internally?
    return ctx.prisma.courses.findFirst({ where: { course_id } })
  }

  // getAllCourses
  @Query(() => [Course])
  async getAllCourses(@Ctx() ctx: Context) {
    // add pagination
    return ctx.prisma.courses.findMany()
  }

  // addCourse
  @Mutation(() => Course)
  async addCourse(
    @Ctx() ctx: Context,
    @Arg('courseData', () => CourseInput) courseData: CourseInput
  ) {
    // reject if course name already in use
    const nameAlreadyInUse = await ctx.prisma.courses.findFirst({
      where: { course_name: courseData.course_name },
    })
    if (nameAlreadyInUse) {
      throw Error(
        `Error: Course name "${courseData.course_name}" is already in use`
      )
    }
    return ctx.prisma.courses.create({ data: courseData })
  }

  // editCourse
  @Mutation(() => Course)
  async editCourse(
    @Ctx() ctx: Context,
    @Arg('course_id', () => Int) course_id: number,
    @Arg('courseData', () => CourseInput) courseData: CourseInput
  ) {
    // reject if course name already in use
    const nameAlreadyInUse = await ctx.prisma.courses.findFirst({
      where: { course_name: courseData.course_name, NOT: { course_id } },
    })
    if (nameAlreadyInUse) {
      throw Error(
        `Error: Course name "${courseData.course_name}" is already in use`
      )
    }

    return ctx.prisma.courses.update({
      where: { course_id },
      data: courseData,
    })
  }

  // removeCourse
  @Mutation(() => Course)
  async removeCourse(
    @Ctx() ctx: Context,
    @Arg('course_id', () => Int) course_id: number
  ) {
    // check for current workshops
    const hasWorkshops = await ctx.prisma.workshops.count({
      where: { course_id },
    })
    if (hasWorkshops) {
      throw Error(
        `Cannot delete course with past or present workshops assigned`
      )
    }

    return ctx.prisma.courses.delete({ where: { course_id } })
  }

  // workshops // field resolver
}
