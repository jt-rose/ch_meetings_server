import { CustomError } from '../../middleware/errorHandler'
import {
  Resolver,
  FieldResolver,
  Query,
  Mutation,
  Root,
  Arg,
  Ctx,
  Int,
} from 'type-graphql'
import { Context } from '../../utils/context'
import { Course, CourseInput } from './Course'
import { Coursework } from './Coursework'

@Resolver(Course)
export class CourseResolver {
  @FieldResolver(() => [Coursework])
  async coursework(@Ctx() ctx: Context, @Root() root: Course) {
    const coursework = await ctx.prisma.courses
      .findUnique({ where: { course_id: root.course_id } })
      .courses_and_coursework({ include: { coursework: true } })
    // remove many to many relationship and return coursework directly
    return coursework.map((x) => x.coursework)
  }

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
      throw new CustomError(
        `Error: Course name "${courseData.course_name}" is already in use`
      )
    }
    return ctx.prisma.courses.create({
      data: { ...courseData, created_by: ctx.req.session.manager_id! },
    })
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
      throw new CustomError(
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
      throw new CustomError(
        `Cannot delete course with past or present workshops assigned`
      )
    }

    return ctx.prisma.courses.delete({ where: { course_id } })
  }

  // workshops // field resolver
}
