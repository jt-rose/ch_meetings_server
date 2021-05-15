import { Resolver, Query, Mutation, Arg, Ctx } from 'type-graphql'
import { Context } from '../../utils/context'
import { Course, CourseInput } from '../objects/Course'

@Resolver(Course)
export class CourseResolver {
  // getCourse
  @Query(() => Course)
  async getCourse(
    @Ctx() ctx: Context,
    @Arg('course_name', () => String) course_name: string
  ) {
    // use await internally?
    return ctx.prisma.courses.findFirst({ where: { course_name } })
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
    // the course_name is a PK, so SQL will reject it
    // if it is a duplicate - no backend vlidation needed
    return ctx.prisma.courses.create({ data: courseData })
  }

  // editCourse
  @Mutation(() => Course)
  async editCourse(
    @Ctx() ctx: Context,
    @Arg('uneditedCourseName', () => String) uneditedCourseName: string,
    @Arg('courseData', () => CourseInput) courseData: CourseInput
  ) {
    // update to make input args option
    return ctx.prisma.courses.update({
      where: { course_name: uneditedCourseName },
      data: courseData,
    })
  }

  // removeCourse
  @Mutation(() => Course)
  async removeCourse(
    @Ctx() ctx: Context,
    @Arg('course_name', () => String) course_name: string
  ) {
    // check for current workshops
    const hasWorkshops = await ctx.prisma.courses.count({
      where: { course_name },
    })
    if (hasWorkshops) {
      throw Error(
        `Course ${course_name} cannot be deleted because this course currently has past or present workshops assigned`
      )
    }

    return ctx.prisma.courses.delete({ where: { course_name } })
  }

  // workshops // field resolver
}
