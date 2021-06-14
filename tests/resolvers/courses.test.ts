import { describe } from 'mocha'
import { expect } from 'chai'
import { testQuery } from '../queryTester'
import { seed } from '../../prisma/seed'
import { clear } from '../../prisma/clear'
import { prisma } from '../../src/prisma'

describe('Course Resolvers', function () {
  /* --------------------- seed and clear DB for each test -------------------- */

  before('clear any data at the start', async function () {
    await clear()
  })

  beforeEach('seed database', async function () {
    await seed()
  })

  afterEach('clear database', async function () {
    await clear()
  })

  after('restore database for local testing', async function () {
    await seed()
  })

  /* ------------------------------ create course ----------------------------- */

  it('create course', async function () {
    const result = await testQuery(`#graphql
         mutation {
            addCourse(courseData: { course_name: "test_course", course_description: "course_description", active: true, virtual_course: true}) {
              course_name
              course_description
              active
              virtual_course
            }
          }
      `)

    const expectedResult = {
      data: {
        addCourse: {
          course_name: 'test_course',
          course_description: 'course_description',
          active: true,
          virtual_course: true,
        },
      },
    }
    expect(result.data).to.eql(expectedResult)

    // confirm database updated as expected
    const checkDB = await prisma.courses.count({
      where: {
        course_name: 'test_course',
        course_description: 'course_description',
        active: true,
        virtual_course: true,
      },
    })
    expect(checkDB).to.eql(1)
  })
  /* ---------------- reject creating course -> already exisits --------------- */
  it('reject creating course when course name already exists', async function () {
    const result = await testQuery(`#graphql
        mutation {
  addCourse(courseData: { course_name: "Course 301", course_description: "course_description", active: true, virtual_course: true}) {
    course_name
    course_description
    active
    virtual_course
  }
}
        `)

    expect(
      result.data.errors[0].message.includes(
        'Error: Course name "Course 301" is already in use'
      )
    ).to.be.true
  })

  it('retrieve course', async function () {
    const result = await testQuery(`#graphql
        query {
  getCourse(course_id: 4) {
    course_name
    course_description
    active
    virtual_course
  }
}
        `)

    const expectedResult = {
      data: {
        getCourse: {
          course_name: 'Course 301',
          course_description: 'the advanced level - only in person',
          active: true,
          virtual_course: false,
        },
      },
    }

    expect(result.data).to.eql(expectedResult)
  })
  /* -------------------------- retrieve all courses -------------------------- */
  it('retrieve all courses', async function () {
    const result = await testQuery(`#graphql
        query {
  getAllCourses {
    course_name
    course_description
    active
    virtual_course
  }
}
        `)
    const expectedResult = {
      data: {
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
    }

    expect(result.data).to.eql(expectedResult)
  })
  /* ------------------------------- edit course ------------------------------ */
  it('edit course and related workshops', async function () {
    const result = await testQuery(`#graphql
mutation {
  editCourse(course_id: 1, courseData: { course_name: "Course 901", course_description: "test", active: true, virtual_course: true}) {
    course_name
  }
  }
`)

    const expectedResult = {
      data: {
        editCourse: {
          course_name: 'Course 901',
        },
      },
    }

    expect(result.data).to.eql(expectedResult)

    // confirm database updated as expected
    const checkDB = await prisma.courses.count({
      where: { course_name: 'Course 901' },
    })
    expect(checkDB).to.eql(1)
  })
  /* -------------- reject update to course -> name already used -------------- */
  it('reject updating course to a name already registered', async function () {
    const result = await testQuery(`#graphql
    mutation {
  editCourse(course_id: 5, courseData: { course_name: "Course 101", course_description: "test", active: true, virtual_course: true}) {
    course_name
  }
  }
    `)

    expect(
      result.data.errors[0].message.includes(
        'Error: Course name "Course 101" is already in use'
      )
    ).to.be.true
  })
  /* ------------------------------ delete course ----------------------------- */
  it('delete course', async function () {
    const result = await testQuery(`#graphql
          mutation {
            removeCourse(course_id: 5) {
              course_name
            }
          }
      `)

    const expectedResult = {
      data: {
        removeCourse: {
          course_name: 'Course 999',
        },
      },
    }
    expect(result.data).to.eql(expectedResult)

    // confirm database updated as expected
    const checkDB = await prisma.courses.count({
      where: { course_id: 5 },
    })
    expect(checkDB).to.eql(0)
  })
  /* ---------- reject deleting course -> workshops already assigned ---------- */
  it('reject deleting course when workshops already assigned to it', async function () {
    const result = await testQuery(`#graphql
          mutation {
            removeCourse(course_id: 1) {
              course_name
            }
          }
      `)

    expect(result.data.errors[0].message).to.eql(
      'Cannot delete course with past or present workshops assigned'
    )
  })
})
