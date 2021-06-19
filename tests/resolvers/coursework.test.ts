import { describe } from 'mocha'
import { expect } from 'chai'
import { testQuery } from '../queryTester'
import { seed } from '../../prisma/seed'
import { clear } from '../../prisma/clear'
import { prisma } from '../../src/prisma'

describe('Coursework Resolvers', function () {
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
  /* ----------------------- test courses field resolver ---------------------- */
  it('access related coursework through course field resolver', async function () {
    const result = await testQuery(`#graphql
    query {
  getCourse(course_id: 1) {
    coursework {
      coursework_name
    }
  }
}
    `)

    const expectedResult = {
      data: {
        getCourse: {
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
    }

    expect(result.data).to.eql(expectedResult)
  })

  /* -------------------------- test coursework CRUD -------------------------- */
  it('create courswork', async function () {
    const result = await testQuery(`#graphql
    mutation {
  addCoursework(name: "test-123", description: "test adding coursework") {
    coursework_name
    coursework_description
  }
}
    `)

    const expectedResult = {
      data: {
        addCoursework: {
          coursework_name: 'test-123',
          coursework_description: 'test adding coursework',
        },
      },
    }

    expect(result.data).to.eql(expectedResult)

    const checkDB = await prisma.coursework.count({
      where: { coursework_name: 'test-123' },
    })
    expect(checkDB).to.eql(1)
  })
  it(' retrieve all coursework', async function () {
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
  it('edit coursework', async function () {
    const result = await testQuery(`#graphql
    mutation {
  editCoursework(courseworkInput: {coursework_id: 1, coursework_name: "new coursework name", coursework_description: "edit my coursework please", active: false }) {
    coursework_name
    coursework_description
    active
  }
}
    `)

    const expectedResult = {
      data: {
        editCoursework: {
          coursework_name: 'new coursework name',
          coursework_description: 'edit my coursework please',
          active: false,
        },
      },
    }

    expect(result.data).to.eql(expectedResult)

    const checkDB = await prisma.coursework.count({
      where: {
        coursework_name: 'new coursework name',
        coursework_description: 'edit my coursework please',
        active: false,
      },
    })

    expect(checkDB).to.eql(1)
  })
  it('remove coursework', async function () {
    const result = await testQuery(`#graphql
    mutation {
  removeCoursework(coursework_id: 6) {
    coursework_name
    coursework_description
    active
  }
}
    `)

    const expectedResult = {
      data: {
        removeCoursework: {
          coursework_name: '301 prework',
          coursework_description:
            'Introduction to advanced 301 concepts, to be completed in conjunction with real-world work opportunities. Recommended 3-6 weeks.',
          active: true,
        },
      },
    }

    expect(result.data).to.eql(expectedResult)

    const checkDB = await prisma.coursework.count({
      where: {
        coursework_name: '301 prework',
      },
    })

    expect(checkDB).to.eql(0)
  })
  it('reject removing coursework when assigned to workshop', async function () {
    const result = await testQuery(`#graphql
    mutation {
  removeCoursework(coursework_id: 1) {
    coursework_name
    coursework_description
    active
  }
}
    `)

    const expectedErrorMessage =
      "The change you are trying to make would violate the required relation 'courses_and_courseworkTocoursework' between the `courses_and_coursework` and `coursework` models."

    expect(result.data.data).to.be.null
    expect(result.data.errors[0].message.includes(expectedErrorMessage)).to.be
      .true
  })

  /* -------------- manage many-to-many relationship with courses ------------- */
  it('register coursework as material for course', async function () {
    const result = await testQuery(`#graphql
    mutation {
  registerAsCourseMaterial(coursework_id: 5, course_id: 1) {
    course_id
    coursework_id
  }
}
    `)

    const expectedResult = {
      data: {
        registerAsCourseMaterial: {
          course_id: 1,
          coursework_id: 5,
        },
      },
    }

    expect(result.data).to.eql(expectedResult)

    const checkDB = await prisma.courses_and_coursework.count({
      where: {
        course_id: 1,
        coursework_id: 5,
      },
    })
    expect(checkDB).to.eql(1)
  })
  it('remove coursework from course materials', async function () {
    const result = await testQuery(`#graphql
    mutation {
  removeFromCourseMaterial(course_and_coursework_id: 1) {
    course_id
    coursework_id
  }
}
    `)

    const expectedResult = {
      data: {
        removeFromCourseMaterial: {
          course_id: 1,
          coursework_id: 1,
        },
      },
    }

    expect(result.data).to.eql(expectedResult)

    const checkDB = await prisma.courses_and_coursework.count({
      where: {
        course_id: 1,
        coursework_id: 1,
      },
    })
    expect(checkDB).to.eql(0)
  })
})
