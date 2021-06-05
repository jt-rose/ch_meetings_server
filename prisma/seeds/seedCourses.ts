import { PrismaClient } from '@prisma/client'

export const seedCourses = async (prisma: PrismaClient) => {
  const courses = await prisma.courses.createMany({
    data: [
      {
        course_id: 1,
        course_name: 'Course 101',
        course_description: 'the basics',
        active: true,
        virtual_course: true,
      },
      {
        course_id: 2,
        course_name: 'Course 102 - In-Person',
        course_description: 'the basics, but in person',
        active: true,
        virtual_course: false,
      },
      {
        course_id: 3,
        course_name: 'Course 201',
        course_description: 'the intermediate level',
        active: true,
        virtual_course: true,
      },
      {
        course_id: 4,
        course_name: 'Course 301',
        course_description: 'the advanced level - only in person',
        active: true,
        virtual_course: false,
      },
      {
        course_id: 5,
        course_name: 'Course 999',
        course_description: 'inactive course',
        active: false,
        virtual_course: false,
      },
    ],
  })

  if (courses.count !== 5) {
    console.log(`All courses seeded: false`)
  }
}
