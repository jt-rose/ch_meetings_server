import { describe } from 'mocha'
import { prisma } from '../../src/prisma'
import { createMockApolloUser, MockApolloTestRunners } from '../mockApollo'

describe('Coursework Resolvers', function () {
  /* ------------------- declare mockUser and initialize it ------------------- */
  let mockUser: MockApolloTestRunners

  before(async function () {
    mockUser = await createMockApolloUser()
  })

  /* -------------------------------- run tests ------------------------------- */

  /* ----------------------- test coursework field resolver ---------------------- */
  it('access related courses through courses field resolver', async function () {
    await mockUser.confirmResponse({
      gqlScript: `
    query {
  getAllCoursework {
    coursework_name
    courses {
      course_name
    }
  }
}
    `,
      expectedResult: {
        getAllCoursework: [
          {
            coursework_name: 'Intro Prework',
            courses: [
              {
                course_name: 'Course 101',
              },
              {
                course_name: 'Course 102 - In-Person',
              },
            ],
          },
          {
            coursework_name: 'Intro Postwork',
            courses: [
              {
                course_name: 'Course 101',
              },
              {
                course_name: 'Course 102 - In-Person',
              },
            ],
          },
          {
            coursework_name: 'Learn and Apply Intro Coursework',
            courses: [
              {
                course_name: 'Course 101',
              },
              {
                course_name: 'Course 102 - In-Person',
              },
            ],
          },
          {
            coursework_name: '201 prework',
            courses: [
              {
                course_name: 'Course 201',
              },
            ],
          },
          {
            coursework_name: 'OLD - 201 prework',
            courses: [
              {
                course_name: 'Course 301',
              },
            ],
          },
          {
            coursework_name: '301 prework',
            courses: [],
          },
        ],
      },
    })
  })

  /* -------------------------- test coursework CRUD -------------------------- */
  it('create courswork', async function () {
    await mockUser.confirmResponse({
      gqlScript: `
    mutation {
  addCoursework(name: "test-123", description: "test adding coursework") {
    coursework_name
    coursework_description
  }
}
    `,
      expectedResult: {
        addCoursework: {
          coursework_name: 'test-123',
          coursework_description: 'test adding coursework',
        },
      },
    })

    await mockUser.confirmDBUpdate({
      databaseQuery: prisma.coursework.count({
        where: { coursework_name: 'test-123' },
      }),
    })
  })

  it('retrieve all coursework', async function () {
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

  it('edit coursework', async function () {
    await mockUser.confirmResponse({
      gqlScript: `
    mutation {
  editCoursework(courseworkInput: {coursework_id: 1, coursework_name: "new coursework name", coursework_description: "edit my coursework please", active: false }) {
    coursework_name
    coursework_description
    active
  }
}
    `,
      expectedResult: {
        editCoursework: {
          coursework_name: 'new coursework name',
          coursework_description: 'edit my coursework please',
          active: false,
        },
      },
    })

    await mockUser.confirmDBUpdate({
      databaseQuery: prisma.coursework.count({
        where: {
          coursework_name: 'new coursework name',
          coursework_description: 'edit my coursework please',
          active: false,
        },
      }),
    })
  })

  it('remove coursework', async function () {
    await mockUser.confirmResponse({
      gqlScript: `
    mutation {
  removeCoursework(coursework_id: 6) {
    coursework_name
    coursework_description
    active
  }
}
    `,
      expectedResult: {
        removeCoursework: {
          coursework_name: '301 prework',
          coursework_description:
            'Introduction to advanced 301 concepts, to be completed in conjunction with real-world work opportunities. Recommended 3-6 weeks.',
          active: true,
        },
      },
    })

    await mockUser.confirmDBRemoval({
      databaseQuery: prisma.coursework.count({
        where: {
          coursework_name: '301 prework',
        },
      }),
    })
  })

  it('reject removing coursework when assigned to workshop', async function () {
    await mockUser.confirmError({
      gqlScript: `
    mutation {
  removeCoursework(coursework_id: 1) {
    coursework_name
    coursework_description
    active
  }
}
    `,
      expectedErrorMessage:
        'This coursework is registered to a course and cannot be deleted. Please unregister it first!',
    })
  })

  /* -------------- manage many-to-many relationship with courses ------------- */
  it('register coursework as material for course', async function () {
    await mockUser.confirmResponse({
      gqlScript: `
    mutation {
  registerAsCourseMaterial(coursework_id: 5, course_id: 1) {
    course_id
    coursework_id
  }
}
    `,
      expectedResult: {
        registerAsCourseMaterial: {
          course_id: 1,
          coursework_id: 5,
        },
      },
    })

    await mockUser.confirmDBUpdate({
      databaseQuery: prisma.courses_and_coursework.count({
        where: {
          course_id: 1,
          coursework_id: 5,
        },
      }),
    })
  })
  it('remove coursework from course materials', async function () {
    await mockUser.confirmResponse({
      gqlScript: `
    mutation {
  removeFromCourseMaterial(course_and_coursework_id: 1) {
    course_id
    coursework_id
  }
}
    `,
      expectedResult: {
        removeFromCourseMaterial: {
          course_id: 1,
          coursework_id: 1,
        },
      },
    })

    await mockUser.confirmDBRemoval({
      databaseQuery: prisma.courses_and_coursework.count({
        where: {
          course_id: 1,
          coursework_id: 1,
        },
      }),
    })
  })
})
