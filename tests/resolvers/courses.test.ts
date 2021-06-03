import { describe } from 'mocha'
import { expect } from 'chai'
import { testQuery } from '../queryTester'
import { seed } from '../../prisma/seed'
import { clear } from '../../prisma/clear'

before('clear any data at the start', async () => {
  await clear()
})

beforeEach('seed database', async () => {
  await seed()
})

afterEach('clear database', async () => {
  await clear()
})

after('restore database for local testing', async () => {
    await seed()
  })
  
describe('Course Resolvers', () => {
    /* ------------------------------ create course ----------------------------- */
    it('create course', async () => {
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
        "data": {
            "addCourse": {
              "course_name": "test_course",
              "course_description": "course_description",
              "active": true,
              "virtual_course": true
            }
          }
    }
    expect(result.data).to.eql(expectedResult)
    })
/* ---------------- reject creating course -> already exisits --------------- */
    it('reject creating course when course name already exists', async () => {
        expect(true).to.be.false
    })

    it('retrieve course', async () => {
        const result = await testQuery(`#graphql
        query {
  getCourse(course_name: "Course 101") {
    course_name
    course_description
    active
    virtual_course
  }
}
        `)

        const expectedResult = ''

        expect(result.data).to.eql(expectedResult)
    })
    /* -------------------------- retrieve all courses -------------------------- */
    it('retrieve all courses', async () => {
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
        const expectedResult = ''

        expect(result.data).to.eql(expectedResult)
    })
    /* ------------------------------- edit course ------------------------------ */
    it('edit course', async () => {
        expect(true).to.be.false
    })
    /* -------------- reject update to course -> name already used -------------- */
    it('reject updating course to a name already registered', async () => {
        expect(true).to.be.false
    })
    /* ------------------------------ delete course ----------------------------- */
    it('delete course', async () => {
        expect(true).to.be.false
    })
    /* ---------- reject deleting course -> workshops already assigned ---------- */
    it('reject deleting course when workshops already assigned to it', async () => {
        expect(true).to.be.false
    })
})