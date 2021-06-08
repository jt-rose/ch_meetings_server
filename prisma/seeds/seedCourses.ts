import { PrismaClient } from '@prisma/client'

export const seedCourses = async (prisma: PrismaClient) => {
  /* ------------------------------ seed courses ------------------------------ */
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

  /* ----------------------------- seed coursework ---------------------------- */
  const coursework = await prisma.coursework.createMany({
    data: [
      {
        coursework_id: 1,
        coursework_name: 'Intro Prework',
        coursework_description:
          'Foundation eLearning to introduce basic concepts. Recommended 2-4 weeks, before coursework.',
        active: true,
      },
      {
        coursework_id: 2,
        coursework_name: 'Intro Postwork',
        coursework_description:
          'Reinforement exercises to be done after completing intro course. Recommended 2-4 weeks, after coursework.',
        active: true,
      },
      {
        coursework_id: 3,
        coursework_name: 'Learn and Apply Intro Coursework',
        coursework_description:
          'Combined foundations introduction and reinforcement exercises. Recommended 4-8 weeks, before coursework.',
        active: true,
      },
      {
        coursework_id: 4,
        coursework_name: '201 prework',
        coursework_description:
          'Introduction to 201 concepts and quick refresher on 101 materials. Recommended 2-4 weeks.',
        active: true,
      },
      {
        coursework_id: 5,
        coursework_name: 'OLD - 201 prework',
        coursework_description:
          'RETIRED - PLEASE USE THE CURRENT "201 prework"! Original description: Introduction to 201 concepts and quick refresher on 101 materials. Recommended 2-4 weeks.',
        active: false,
      },
      {
        coursework_id: 6,
        coursework_name: '301 prework',
        coursework_description:
          'Introduction to advanced 301 concepts, to be completed in conjunction with real-world work opportunities. Recommended 3-6 weeks.',
        active: true,
      },
    ],
  })
  if (coursework.count !== 6) {
    console.log(`All coursework seeded: false`)
  }

  /* ---------- seed course and coursework many to many relationshop ---------- */
  const coursesAndCoursework = await prisma.courses_and_coursework.createMany({
    data: [
      { course_and_coursework_id: 1, course_id: 1, coursework_id: 1 },
      { course_and_coursework_id: 2, course_id: 1, coursework_id: 2 },
      { course_and_coursework_id: 3, course_id: 1, coursework_id: 3 },
      { course_and_coursework_id: 4, course_id: 2, coursework_id: 1 },
      { course_and_coursework_id: 5, course_id: 2, coursework_id: 2 },
      { course_and_coursework_id: 6, course_id: 2, coursework_id: 3 },
      { course_and_coursework_id: 7, course_id: 3, coursework_id: 4 },
      { course_and_coursework_id: 8, course_id: 4, coursework_id: 5 },
    ],
  })

  if (coursesAndCoursework.count !== 8) {
    console.log(`All courses_and_coursework seeded: false`)
  }
}
