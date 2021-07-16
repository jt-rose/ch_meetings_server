import { Resolver, Arg, Ctx, Int, Mutation } from 'type-graphql'
import { AdvisorNote } from '../objects/AdvisorNote'
import { Context } from '../../utils/context'
import { Authenticated } from '../../middleware/authChecker'

// Advisor notes will be accessed as a field resolver on the Advisor data
// therefore, no read functionality is needed in this resolver

@Resolver(AdvisorNote)
export class AdvisorNoteResolver {
  @Authenticated()
  @Mutation(() => AdvisorNote)
  async addAdvisorNote(
    @Ctx() ctx: Context,
    @Arg('advisor_id', () => Int) advisor_id: number,
    @Arg('advisor_note') advisor_note: string
  ) {
    return ctx.prisma.advisor_notes.create({
      data: {
        advisor_id,
        advisor_note,
        created_by: ctx.req.session.manager_id!,
      },
    })
  }

  @Authenticated()
  @Mutation(() => AdvisorNote)
  async editAdvisorNote(
    @Ctx() ctx: Context,
    @Arg('note_id', () => Int) note_id: number,
    @Arg('advisor_note') advisor_note: string
  ) {
    return ctx.prisma.advisor_notes.update({
      where: { note_id },
      data: { advisor_note },
    })
  }

  @Authenticated()
  @Mutation(() => AdvisorNote)
  async removeAdvisorNote(
    @Ctx() ctx: Context,
    @Arg('note_id', () => Int) note_id: number
  ) {
    return ctx.prisma.advisor_notes.delete({ where: { note_id } })
  }
}
