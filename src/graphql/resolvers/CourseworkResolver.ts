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
import { Coursework } from '../objects/Coursework'
import { Course } from '../objects/Course'
import { CoursesToCoursework } from '../objects/CoursesToCoursework'

// coursework input
@InputType()
class CourseworkInput {
  @Field(() => Int)
  coursework_id: number

  @Field()
  coursework_name: string

  @Field()
  coursework_description: string | null

  @Field()
  active: boolean
}

@Resolver(Coursework)
export class CourseworkResolver {
  @FieldResolver(() => [Course])
  courses(@Ctx() ctx: Context, @Root() root: Coursework) {
    // check for n+1
    return ctx.prisma.coursework
      .findUnique({ where: { coursework_id: root.coursework_id } })
      .courses_and_coursework({ include: { courses: true } })
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
  removeCoursework(
    @Ctx() ctx: Context,
    @Arg('coursework_id', () => Int) coursework_id: number
  ) {
    return ctx.prisma.coursework.delete({ where: { coursework_id } })
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