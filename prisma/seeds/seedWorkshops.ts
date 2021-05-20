import { PrismaClient } from '@prisma/client'

// prisma seeding for workshops
// with relational fields for workshop_sessions,
// workshop_notes, and change_logs

export const seedWorkshops = async (prisma: PrismaClient) => {
  const workshop1 = await prisma.workshops.create({
    data: {
      course_type: 'Course 101',
      requested_advisor: 'john.doe@email.com',
      backup_requested_advisor: 'henri@email.net',
      assigned_advisor: 'john.doe@email.com',
      workshop_location: 'Zoom',
      client: 1,
      open_air_id: 'OPID23560h-jk',
      time_zone: 'EST',
      workshop_language: 'English',
      record_attendance: true,
      workshop_sessions: {
        createMany: {
          data: [
            {
              date_and_time: '2021-7-22T08:00:00EST',
              duration_in_hours: 2,
              zoom_link: 'www.zoom.com/user/abcdef1234',
              session_status: 'SCHEDULED',
            },
            {
              date_and_time: '2021-7-23T08:00:00EST',
              duration_in_hours: 2,
              zoom_link: 'www.zoom.com/user/abcdef1234',
              session_status: 'SCHEDULED',
            },
            {
              date_and_time: '2021-7-24T08:00:00EST',
              duration_in_hours: 2,
              zoom_link: 'www.zoom.com/user/abcdef1234',
              session_status: 'SCHEDULED',
            },
            {
              date_and_time: '2021-7-25T08:00:00EST',
              duration_in_hours: 2,
              zoom_link: 'www.zoom.com/user/abcdef1234',
              session_status: 'SCHEDULED',
            },
          ],
        },
      },
      workshop_notes: {
        createMany: {
          data: [{ note: 'Client has requested translation of XYZ materials' }],
        },
      },
      change_log: {
        createMany: {
          data: [
            {
              note: 'workshop request created',
              log_date: '2020-11-15T11:23:00EST',
            },
            { note: 'workshop assigned', log_date: '2020-11-17T15:44:00EST' },
          ],
        },
      },
    },
  })

  const workshop2 = await prisma.workshops.create({
    data: {
      course_type: 'Course 101',
      requested_advisor: 'henri@email.net',
      assigned_advisor: 'henri@email.net',
      workshop_location: 'Zoom',
      client: 1,
      open_air_id: 'OPID23560h-jk',
      time_zone: 'CET',
      workshop_language: 'French',
      record_attendance: true,
      workshop_sessions: {
        createMany: {
          data: [
            {
              date_and_time: '2021-7-22T08:00:00CET',
              duration_in_hours: 2,
              zoom_link: 'www.zoom.com/user/abcdef1234',
              session_status: 'SCHEDULED',
            },
            {
              date_and_time: '2021-7-23T08:00:00CET',
              duration_in_hours: 2,
              zoom_link: 'www.zoom.com/user/abcdef1234',
              session_status: 'SCHEDULED',
            },
            {
              date_and_time: '2021-7-24T08:00:00CET',
              duration_in_hours: 2,
              zoom_link: 'www.zoom.com/user/abcdef1234',
              session_status: 'SCHEDULED',
            },
            {
              date_and_time: '2021-7-25T08:00:00CET',
              duration_in_hours: 2,
              zoom_link: 'www.zoom.com/user/abcdef1234',
              session_status: 'SCHEDULED',
            },
          ],
        },
      },
      workshop_notes: {
        createMany: {
          data: [
            {
              workshop_session_id: 6,
              note: 'Managers John Doe and Jane Doe will be joining as observers',
            },
            {
              workshop_session_id: 7,
              note: 'Participants Phil Lowe and Stacy Adams will be unavailable and joining workshop 3/ session 3 to make up for it',
            },
          ],
        },
      },
      change_log: {
        createMany: {
          data: [
            {
              note: 'workshop request created',
              log_date: '2021-01-22T12:18:00EST',
            },
            { note: 'workshop assigned', log_date: '2021-01-29T16:02:00EST' },
          ],
        },
      },
    },
  })

  const workshop3 = await prisma.workshops.create({
    data: {
      course_type: 'Course 101',
      requested_advisor: 'yusuke@tokyo.co.jp',
      assigned_advisor: 'yusuke@tokyo.co.jp',
      workshop_location: 'Teams',
      client: 1,
      open_air_id: 'OPID23560h-jk',
      time_zone: 'PT',
      workshop_language: 'Japanese',
      record_attendance: false,
      workshop_sessions: {
        createMany: {
          data: [
            {
              date_and_time: '2021-8-01T08:00:00PST',
              duration_in_hours: 2,
              zoom_link: 'www.zoom.com/user/abcdef1234',
              session_status: 'REQUESTED',
            },
            {
              date_and_time: '2021-8-08T08:00:00PST',
              duration_in_hours: 2,
              zoom_link: 'www.zoom.com/user/abcdef1234',
              session_status: 'REQUESTED',
            },
            {
              date_and_time: '2021-8-15T08:00:00PST',
              duration_in_hours: 2,
              zoom_link: 'www.zoom.com/user/abcdef1234',
              session_status: 'REQUESTED',
            },
            {
              date_and_time: '2021-8-22T08:00:00PST',
              duration_in_hours: 2,
              zoom_link: 'www.zoom.com/user/abcdef1234',
              session_status: 'REQUESTED',
            },
          ],
        },
      },
      workshop_notes: {
        createMany: {
          data: [
            {
              workshop_session_id: 11,
              note: 'Phil Lowe and Stacy Adams will be joining from workshop 2, session 3',
            },
          ],
        },
      },
      change_log: {
        createMany: {
          data: [
            {
              note: 'workshop request created',
              log_date: '2021-02-03T09:01:00EST',
            },
            { note: 'workshop assigned', log_date: '2021-02-10T12:56:00EST' },
          ],
        },
      },
    },
  })

  const workshop4 = await prisma.workshops.create({
    data: {
      course_type: 'Course 101',
      requested_advisor: 'henri@email.net',
      backup_requested_advisor: 'john.doe@email.com',
      assigned_advisor: 'john.doe@email.com',
      workshop_location: 'Zoom',
      client: 3,
      open_air_id: 'OPID236789',
      time_zone: 'EST',
      workshop_language: 'English',
      record_attendance: false,
      workshop_sessions: {
        createMany: {
          data: [
            {
              date_and_time: '2021-10-20T08:00:00EST',
              duration_in_hours: 1.5,
              zoom_link: 'www.zoom.com/user/abcdef1234',
              session_status: 'SCHEDULED',
            },
            {
              date_and_time: '2021-10-22T08:00:00EST',
              duration_in_hours: 1.5,
              zoom_link: 'www.zoom.com/user/abcdef1234',
              session_status: 'SCHEDULED',
            },
            {
              date_and_time: '2021-10-24T08:00:00EST',
              duration_in_hours: 1.5,
              zoom_link: 'www.zoom.com/user/abcdef1234',
              session_status: 'HOLD_A',
            },
            {
              date_and_time: '2021-10-26T08:00:00EST',
              duration_in_hours: 1.5,
              zoom_link: 'www.zoom.com/user/abcdef1234',
              session_status: 'SCHEDULED',
            },
          ],
        },
      },
      change_log: {
        createMany: {
          data: [
            {
              note: 'workshop request created',
              log_date: '2021-11-01T10:03:00EST',
            },
            { note: 'workshop assigned', log_date: '2021-11-17T15:34:00EST' },
            {
              note: 'session 3 timing conflict for client. Placed in Hold while gathering new dates',
              log_date: '2021-11-18T07:34:00EST',
            },
          ],
        },
      },
    },
  })

  const workshop5 = await prisma.workshops.create({
    data: {
      course_type: 'Course 301',
      requested_advisor: 'jorge@advisor.net',
      assigned_advisor: 'jorge@advisor.net',
      workshop_location: 'Sao Paulo, Brazil',
      client: 4,
      open_air_id: 'OPID23560h-jk',
      time_zone: 'EST',
      workshop_language: 'Spanish',
      record_attendance: true,
      workshop_sessions: {
        createMany: {
          data: [
            {
              date_and_time: '2021-12-03T08:00:00EST',
              duration_in_hours: 2,
              zoom_link: 'www.zoom.com/user/abcdef1234',
              session_status: 'SCHEDULED',
            },
            {
              date_and_time: '2021-12-10T08:00:00EST',
              duration_in_hours: 2,
              zoom_link: 'www.zoom.com/user/abcdef1234',
              session_status: 'SCHEDULED',
            },
            {
              date_and_time: '2021-12-17T08:00:00EST',
              duration_in_hours: 2,
              zoom_link: 'www.zoom.com/user/abcdef1234',
              session_status: 'SCHEDULED',
            },
            {
              date_and_time: '2021-12-24T08:00:00EST',
              duration_in_hours: 2,
              zoom_link: 'www.zoom.com/user/abcdef1234',
              session_status: 'SCHEDULED',
            },
          ],
        },
      },
      change_log: {
        createMany: {
          data: [
            {
              note: 'workshop request created',
              log_date: '2020-12-20T08:24:00EST',
            },
            { note: 'workshop assigned', log_date: '2020-12-22T15:54:00EST' },
          ],
        },
      },
    },
  })

  const workshop6 = await prisma.workshops.create({
    data: {
      course_type: 'Course 201',
      requested_advisor: 'henri@email.net',
      backup_requested_advisor: 'john.doe@email.com',
      assigned_advisor: 'henri@email.net',
      workshop_location: 'Zoom',
      client: 5,
      open_air_id: 'OPID2354688',
      time_zone: 'CET',
      workshop_language: 'English',
      record_attendance: true,
      workshop_sessions: {
        createMany: {
          data: [
            {
              date_and_time: '2021-11-03T14:00:00CET',
              duration_in_hours: 2,
              zoom_link: 'www.zoom.com/user/abcdef1234',
              session_status: 'SCHEDULED',
            },
            {
              date_and_time: '2021-11-10T14:00:00CET',
              duration_in_hours: 2,
              zoom_link: 'www.zoom.com/user/abcdef1234',
              session_status: 'REQUESTED',
            },
            {
              date_and_time: '2021-11-17T14:30:00CET',
              duration_in_hours: 2,
              zoom_link: 'www.zoom.com/user/abcdef1234',
              session_status: 'REQUESTED',
            },
            {
              date_and_time: '2021-11-24T14:00:00CET',
              duration_in_hours: 2,
              zoom_link: 'www.zoom.com/user/abcdef1234',
              session_status: 'SCHEDULED',
            },
          ],
        },
      },
      workshop_notes: {
        createMany: {
          data: [
            {
              note: 'Client has requested previous template of training materials ABC be used',
            },
            {
              workshop_session_id: 21,
              note: 'Head of Sales Andrea Slonik will be joining to observe process',
            },
          ],
        },
      },
      change_log: {
        createMany: {
          data: [
            {
              note: 'workshop request created',
              log_date: '2021-03-24T09:39:00EST',
            },
            {
              note: 'session 1 and 4 confirmed, waiting for confirmation on 2 and 3',
              log_date: '2021-03-28T16:47:00EST',
            },
          ],
        },
      },
    },
  })

  const workshops = [
    workshop1,
    workshop2,
    workshop3,
    workshop4,
    workshop5,
    workshop6,
  ]

  console.log(`Workshops seeded in database: ${workshops.every((x) => x)}`)
}
