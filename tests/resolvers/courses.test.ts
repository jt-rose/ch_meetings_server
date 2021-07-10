import { describe } from 'mocha'
import { prisma } from '../../src/prisma'
import { createMockApolloUser, MockApolloTestRunners } from '../mockApollo'

describe('Course Resolvers', function () {
  /* ------------------- declare mockUser and initialize it ------------------- */
  let mockUser: MockApolloTestRunners

  before(async function () {
    mockUser = await createMockApolloUser()
  })

  /* -------------------------------- run tests ------------------------------- */

  /* --------------------- test coursework field resolver --------------------- */
  it('access related coursework through field resolver', async function () {
    await mockUser.confirmResponse({
      gqlScript: `
    query {
  getCourse(course_id: 1) {
    course_name
    coursework {
      coursework_name
    }
  }
}
    `,
      expectedResult: {
        getCourse: {
          course_name: 'Course 101',
          coursework: [
            {
              coursework_name: 'Intro Prework',
            },
            {
              coursework_name: 'Intro Postwork',
            },
            {
              coursework_name: 'Learn and Apply Intro Coursework',
            },
          ],
        },
      },
    })
  })

  /* ------------------------------ create course ----------------------------- */

  it('create course', async function () {
    await mockUser.confirmResponse({
      gqlScript: `
         mutation {
            addCourse(courseData: { course_name: "test_course", course_description: "course_description", active: true, virtual_course: true}) {
              course_name
              course_description
              active
              virtual_course
            }
          }
      `,
      expectedResult: {
        addCourse: {
          course_name: 'test_course',
          course_description: 'course_description',
          active: true,
          virtual_course: true,
        },
      },
    })

    // confirm database updated as expected
    await mockUser.confirmDBUpdate({
      databaseQuery: prisma.courses.count({
        where: {
          course_name: 'test_course',
          course_description: 'course_description',
          active: true,
          virtual_course: true,
        },
      }),
    })
  })
  /* ---------------- reject creating course -> already exisits --------------- */
  it('reject creating course when course name already exists', async function () {
    await mockUser.confirmError({
      gqlScript: `
        mutation {
  addCourse(courseData: { course_name: "Course 301", course_description: "course_description", active: true, virtual_course: true}) {
    course_name
    course_description
    active
    virtual_course
  }
}
        `,
      expectedErrorMessage: 'Error: Course name "Course 301" is already in use',
    })
  })

  it('retrieve course', async function () {
    await mockUser.confirmResponse({
      gqlScript: `
        query {
  getCourse(course_id: 4) {
    course_name
    course_description
    active
    virtual_course
  }
}
        `,
      expectedResult: {
        getCourse: {
          course_name: 'Course 301',
          course_description: 'the advanced level - only in person',
          active: true,
          virtual_course: false,
        },
      },
    })
  })
  /* -------------------------- retrieve all courses -------------------------- */
  it('retrieve all courses', async function () {
    await mockUser.confirmResponse({
      gqlScript: `
        query {
  getAllCourses {
    course_name
    course_description
    active
    virtual_course
  }
}
        `,
      expectedResult: {
        getAllCourses: [
          {
            course_name: 'Course 101',
            course_description: 'the basics',
            active: true,
            virtual_course: true,
          },
          {
            course_name: 'Course 102 - In-Person',
            course_description: 'the basics, but in person',
            active: true,
            virtual_course: false,
          },
          {
            course_name: 'Course 201',
            course_description: 'the intermediate level',
            active: true,
            virtual_course: true,
          },
          {
            course_name: 'Course 301',
            course_description: 'the advanced level - only in person',
            active: true,
            virtual_course: false,
          },
          {
            course_name: 'Course 999',
            course_description: 'inactive course',
            active: false,
            virtual_course: false,
          },
        ],
      },
    })
  })
  /* ------------------------------- edit course ------------------------------ */
  it('edit course and related workshops', async function () {
    await mockUser.confirmResponse({
      gqlScript: `
mutation {
  editCourse(course_id: 1, courseData: { course_name: "Course 901", course_description: "test", active: true, virtual_course: true}) {
    course_name
  }
  }
`,
      expectedResult: {
        editCourse: {
          course_name: 'Course 901',
        },
      },
    })

    // confirm database updated as expected
    await mockUser.confirmDBUpdate({
      databaseQuery: prisma.courses.count({
        where: { course_name: 'Course 901' },
      }),
    })
  })
  /* -------------- reject update to course -> name already used -------------- */
  it('reject updating course to a name already registered', async function () {
    await mockUser.confirmError({
      gqlScript: `
    mutation {
  editCourse(course_id: 5, courseData: { course_name: "Course 101", course_description: "test", active: true, virtual_course: true}) {
    course_name
  }
  }
    `,
      expectedErrorMessage: 'Error: Course name "Course 101" is already in use',
    })
  })
  /* ------------------------------ delete course ----------------------------- */
  it('delete course', async function () {
    await mockUser.confirmResponse({
      gqlScript: `
          mutation {
            removeCourse(course_id: 5) {
              course_name
            }
          }
      `,
      expectedResult: {
        removeCourse: {
          course_name: 'Course 999',
        },
      },
    })

    // confirm database updated as expected
    await mockUser.confirmDBRemoval({
      databaseQuery: prisma.courses.count({
        where: { course_id: 5 },
      }),
    })
  })
  /* ---------- reject deleting course -> workshops already assigned ---------- */
  it('reject deleting course when workshops already assigned to it', async function () {
    await mockUser.confirmError({
      gqlScript: `
          mutation {
            removeCourse(course_id: 1) {
              course_name
            }
          }
      `,
      expectedErrorMessage:
        'Cannot delete course with past or present workshops assigned',
    })
  })
})
