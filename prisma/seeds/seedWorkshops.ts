import { PrismaClient } from '@prisma/client'

// prisma seeding for workshops
// with relational fields for workshop_sessions,
// workshop_notes, and change_logs

export const seedWorkshops = async (prisma: PrismaClient) => {
  const workshop1 = await prisma.workshops.create({
    data: {
      workshop_id: 1,
      course_type: 'Course 101',
      requested_advisor: 'john.doe@email.com',
      backup_requested_advisor: 'henri@email.net',
      assigned_advisor: 'john.doe@email.com',
      workshop_location: 'Zoom',
      client_id: 1,
      open_air_id: 'OPID23560h-jk',
      time_zone: 'EST',
      workshop_language: 'English',
      record_attendance: true,
      workshop_sessions: {
        create: [
          {
            workshop_session_id: 1,
            date_and_time: new Date('July 22 2021 12:00:00 GMT'),
            duration_in_hours: 2,
            zoom_link: 'www.zoom.com/user/abcdef1234',
            session_status: 'SCHEDULED',
            requested_start_times: {
              create: [
                {
                  request_id: 1,
                  earliest_start_time: new Date('July 22 2021 12:00:00 GMT'),
                  latest_start_time: new Date('July 22 2021 12:00:00 GMT'),
                },
              ],
            },
          },
          {
            workshop_session_id: 2,
            date_and_time: new Date('July 23 2021 12:00:00 GMT'),
            duration_in_hours: 2,
            zoom_link: 'www.zoom.com/user/abcdef1234',
            session_status: 'SCHEDULED',
            requested_start_times: {
              create: [
                {
                  request_id: 2,
                  earliest_start_time: new Date('July 23 2021 12:00:00 GMT'),
                  latest_start_time: new Date('July 23 2021 12:00:00 GMT'),
                },
              ],
            },
          },
          {
            workshop_session_id: 3,
            date_and_time: new Date('July 24 2021 12:00:00 GMT'),
            duration_in_hours: 2,
            zoom_link: 'www.zoom.com/user/abcdef1234',
            session_status: 'SCHEDULED',
            requested_start_times: {
              create: [
                {
                  request_id: 3,
                  earliest_start_time: new Date('July 24 2021 12:00:00 GMT'),
                  latest_start_time: new Date('July 24 2021 12:00:00 GMT'),
                },
              ],
            },
          },
          {
            workshop_session_id: 4,
            date_and_time: new Date('July 25 2021 12:00:00 GMT'),
            duration_in_hours: 2,
            zoom_link: 'www.zoom.com/user/abcdef1234',
            session_status: 'SCHEDULED',
            requested_start_times: {
              create: [
                {
                  request_id: 4,
                  earliest_start_time: new Date('July 25 2021 12:00:00 GMT'),
                  latest_start_time: new Date('July 25 2021 12:00:00 GMT'),
                },
              ],
            },
          },
        ],
      },
      workshop_notes: {
        create: [
          {
            note_id: 1,
            note: 'Client has requested translation of XYZ materials',
          },
        ],
      },
      change_log: {
        create: [
          {
            log_id: 1,
            note: 'workshop request created',
            log_date: new Date('Nov 15 2020 15:23:00 GMT'),
          },
          {
            log_id: 2,
            note: 'workshop assigned',
            log_date: new Date('Nov 17 2020 17:44:00 GMT'),
          },
        ],
      },
    },
  })

  const workshop2 = await prisma.workshops.create({
    data: {
      workshop_id: 2,
      course_type: 'Course 101',
      requested_advisor: 'henri@email.net',
      assigned_advisor: 'henri@email.net',
      workshop_location: 'Zoom',
      client_id: 1,
      open_air_id: 'OPID23560h-jk',
      time_zone: 'CET',
      workshop_language: 'French',
      record_attendance: true,
      workshop_sessions: {
        create: [
          {
            workshop_session_id: 5,
            date_and_time: new Date('July 22 2021 06:00:00 GMT'),
            duration_in_hours: 2,
            zoom_link: 'www.zoom.com/user/abcdef1234',
            session_status: 'SCHEDULED',
            requested_start_times: {
              create: [
                {
                  request_id: 5,
                  earliest_start_time: new Date('July 22 2021 06:00:00 GMT'),
                  latest_start_time: new Date('July 22 2021 09:00:00 GMT'),
                },
              ],
            },
          },
          {
            workshop_session_id: 6,
            date_and_time: new Date('July 23 2021 06:00:00 GMT'),
            duration_in_hours: 2,
            zoom_link: 'www.zoom.com/user/abcdef1234',
            session_status: 'SCHEDULED',
            requested_start_times: {
              create: [
                {
                  request_id: 6,
                  earliest_start_time: new Date('July 23 2021 06:00:00 GMT'),
                  latest_start_time: new Date('July 23 2021 09:00:00 GMT'),
                },
              ],
            },
            session_notes: {
              create: [
                {
                  note_id: 1,
                  note: 'Managers John Doe and Jane Doe will be joining as observers',
                },
              ],
            },
          },
          {
            workshop_session_id: 7,
            date_and_time: new Date('July 24 2021 06:00:00 GMT'),
            duration_in_hours: 2,
            zoom_link: 'www.zoom.com/user/abcdef1234',
            session_status: 'SCHEDULED',
            requested_start_times: {
              create: [
                {
                  request_id: 7,
                  earliest_start_time: new Date('July 24 2021 06:00:00 GMT'),
                  latest_start_time: new Date('July 24 2021 09:00:00 GMT'),
                },
              ],
            },
            session_notes: {
              create: [
                {
                  note_id: 2,
                  note: 'Participants Phil Lowe and Stacy Adams will be unavailable and joining workshop 3/ session 3 to make up for it',
                },
              ],
            },
          },
          {
            workshop_session_id: 8,
            date_and_time: new Date('July 25 2021 06:00:00 GMT'),
            duration_in_hours: 2,
            zoom_link: 'www.zoom.com/user/abcdef1234',
            session_status: 'SCHEDULED',
            requested_start_times: {
              create: [
                {
                  request_id: 8,
                  earliest_start_time: new Date('July 25 2021 06:00:00 GMT'),
                  latest_start_time: new Date('July 25 2021 09:00:00 GMT'),
                },
              ],
            },
          },
        ],
      },
      change_log: {
        create: [
          {
            log_id: 3,
            note: 'workshop request created',
            log_date: new Date('Jan 12 2021 15:23:00 GMT'),
          },
          {
            log_id: 4,
            note: 'workshop assigned',
            log_date: new Date('Jan 29 2021 15:23:00 GMT'),
          },
        ],
      },
    },
  })

  const workshop3 = await prisma.workshops.create({
    data: {
      workshop_id: 3,
      course_type: 'Course 101',
      requested_advisor: 'yusuke@tokyo.co.jp',
      assigned_advisor: 'yusuke@tokyo.co.jp',
      workshop_location: 'Teams',
      client_id: 1,
      open_air_id: 'OPID23560h-jk',
      time_zone: 'PT',
      workshop_language: 'Japanese',
      record_attendance: false,
      workshop_sessions: {
        create: [
          {
            workshop_session_id: 9,
            date_and_time: null,
            duration_in_hours: 2,
            zoom_link: 'www.zoom.com/user/abcdef1234',
            session_status: 'REQUESTED',
            requested_start_times: {
              create: [
                {
                  request_id: 9,
                  earliest_start_time: new Date('Aug 01 2021 07:00:00 GMT'),
                  latest_start_time: new Date('Aug 02 2021 6:59:59 GMT'),
                },
              ],
            },
          },
          {
            workshop_session_id: 10,
            date_and_time: null,
            duration_in_hours: 2,
            zoom_link: 'www.zoom.com/user/abcdef1234',
            session_status: 'REQUESTED',
            requested_start_times: {
              create: [
                {
                  request_id: 10,
                  earliest_start_time: new Date('Aug 08 2021 07:00:00 GMT'),
                  latest_start_time: new Date('Aug 09 2021 6:59:59 GMT'),
                },
              ],
            },
          },
          {
            workshop_session_id: 11,
            date_and_time: null,
            duration_in_hours: 2,
            zoom_link: 'www.zoom.com/user/abcdef1234',
            session_status: 'REQUESTED',
            requested_start_times: {
              create: [
                {
                  request_id: 11,
                  earliest_start_time: new Date('Aug 15 2021 07:00:00 GMT'),
                  latest_start_time: new Date('Aug 16 2021 6:59:59 GMT'),
                },
              ],
            },
            session_notes: {
              create: [
                {
                  note_id: 3,
                  note: 'Phil Lowe and Stacy Adams will be joining from workshop 2, session 3',
                },
              ],
            },
          },
          {
            workshop_session_id: 12,
            date_and_time: null,
            duration_in_hours: 2,
            zoom_link: 'www.zoom.com/user/abcdef1234',
            session_status: 'REQUESTED',
            requested_start_times: {
              create: [
                {
                  request_id: 12,
                  earliest_start_time: new Date('Aug 22 2021 07:00:00 GMT'),
                  latest_start_time: new Date('Aug 23 2021 6:59:59 GMT'),
                },
              ],
            },
          },
        ],
      },
      change_log: {
        create: [
          {
            log_id: 5,
            note: 'workshop request created',
            log_date: new Date('Feb 03 2021 13:01:00 GMT'),
          },
          {
            log_id: 6,
            note: 'workshop assigned',
            log_date: new Date('Feb 10 2021 16:56:00 GMT'),
          },
        ],
      },
    },
  })

  const workshop4 = await prisma.workshops.create({
    data: {
      workshop_id: 4,
      course_type: 'Course 101',
      requested_advisor: 'henri@email.net',
      backup_requested_advisor: 'john.doe@email.com',
      assigned_advisor: 'john.doe@email.com',
      workshop_location: 'Zoom',
      client_id: 3,
      open_air_id: 'OPID236789',
      time_zone: 'EST',
      workshop_language: 'English',
      record_attendance: false,
      workshop_sessions: {
        create: [
          {
            workshop_session_id: 13,
            date_and_time: new Date('Oct 20 2021 14:00:00 GMT'),
            duration_in_hours: 1.5,
            zoom_link: 'www.zoom.com/user/abcdef1234',
            session_status: 'SCHEDULED',
            requested_start_times: {
              create: [
                {
                  request_id: 13,
                  earliest_start_time: new Date('Oct 20 2021 12:00:00 GMT'),
                  latest_start_time: new Date('Oct 20 2021 12:00:00 GMT'),
                },
              ],
            },
          },
          {
            workshop_session_id: 14,
            date_and_time: new Date('Oct 22 2021 14:00:00 GMT'),
            duration_in_hours: 1.5,
            zoom_link: 'www.zoom.com/user/abcdef1234',
            session_status: 'SCHEDULED',
            requested_start_times: {
              create: [
                {
                  request_id: 14,
                  earliest_start_time: new Date('Oct 22 2021 12:00:00 GMT'),
                  latest_start_time: new Date('Oct 22 2021 12:00:00 GMT'),
                },
              ],
            },
          },
          {
            workshop_session_id: 15,
            date_and_time: new Date('Oct 24 2021 14:00:00 GMT'),
            duration_in_hours: 1.5,
            zoom_link: 'www.zoom.com/user/abcdef1234',
            session_status: 'HOLD_A',
            requested_start_times: {
              create: [
                {
                  request_id: 15,
                  earliest_start_time: new Date('Oct 24 2021 12:00:00 GMT'),
                  latest_start_time: new Date('Oct 24 2021 12:00:00 GMT'),
                },
                {
                  request_id: 16,
                  earliest_start_time: new Date('Oct 25 2021 12:00:00 GMT'),
                  latest_start_time: new Date('Oct 25 2021 12:00:00 GMT'),
                },
                {
                  request_id: 17,
                  earliest_start_time: new Date('Oct 25 2021 16:00:00 GMT'),
                  latest_start_time: new Date('Oct 25 2021 16:00:00 GMT'),
                },
              ],
            },
          },
          {
            workshop_session_id: 16,
            date_and_time: new Date('Oct 26 2021 14:00:00 GMT'),
            duration_in_hours: 1.5,
            zoom_link: 'www.zoom.com/user/abcdef1234',
            session_status: 'SCHEDULED',
            requested_start_times: {
              create: [
                {
                  request_id: 18,
                  earliest_start_time: new Date('Oct 26 2021 12:00:00 GMT'),
                  latest_start_time: new Date('Oct 26 2021 12:00:00 GMT'),
                },
              ],
            },
          },
        ],
      },
      change_log: {
        create: [
          {
            log_id: 7,
            note: 'workshop request created',
            log_date: new Date('Nov 01 2020 14:03:00 GMT'),
          },
          {
            log_id: 8,
            note: 'workshop assigned',
            log_date: new Date('Nov 17 2020 16:16:00 GMT'),
          },
          {
            log_id: 9,
            note: 'session 3 timing conflict for client. Placed in Hold while gathering new dates',
            log_date: new Date('Nov 18 2020 11:34:00 GMT'),
          },
        ],
      },
    },
  })

  const workshop5 = await prisma.workshops.create({
    data: {
      workshop_id: 5,
      course_type: 'Course 301',
      requested_advisor: 'jorge@advisor.net',
      assigned_advisor: 'jorge@advisor.net',
      workshop_location: 'Sao Paulo, Brazil',
      client_id: 4,
      open_air_id: 'OPID23560h-jk',
      time_zone: 'EST',
      workshop_language: 'Spanish',
      record_attendance: true,
      workshop_sessions: {
        create: [
          {
            workshop_session_id: 17,
            date_and_time: new Date('Dec 03 2021 13:00:00 GMT'),
            duration_in_hours: 2,
            zoom_link: 'www.zoom.com/user/abcdef1234',
            session_status: 'SCHEDULED',
            requested_start_times: {
              create: [
                {
                  request_id: 19,
                  earliest_start_time: new Date('Dec 03 2021 10:00:00 GMT'),
                  latest_start_time: new Date('Dec 03 2021 15:00:00 GMT'),
                },
              ],
            },
          },
          {
            workshop_session_id: 18,
            date_and_time: new Date('Dec 10 2021 13:00:00 GMT'),
            duration_in_hours: 2,
            zoom_link: 'www.zoom.com/user/abcdef1234',
            session_status: 'SCHEDULED',
            requested_start_times: {
              create: [
                {
                  request_id: 20,
                  earliest_start_time: new Date('Dec 10 2021 10:00:00 GMT'),
                  latest_start_time: new Date('Dec 10 2021 15:00:00 GMT'),
                },
              ],
            },
          },
          {
            workshop_session_id: 19,
            date_and_time: new Date('Dec 17 2021 13:00:00 GMT'),
            duration_in_hours: 2,
            zoom_link: 'www.zoom.com/user/abcdef1234',
            session_status: 'SCHEDULED',
            requested_start_times: {
              create: [
                {
                  request_id: 21,
                  earliest_start_time: new Date('Dec 17 2021 10:00:00 GMT'),
                  latest_start_time: new Date('Dec 17 2021 15:00:00 GMT'),
                },
              ],
            },
          },
          {
            workshop_session_id: 20,
            date_and_time: new Date('Dec 24 2021 11:00:00 GMT'),
            duration_in_hours: 2,
            zoom_link: 'www.zoom.com/user/abcdef1234',
            session_status: 'SCHEDULED',
            requested_start_times: {
              create: [
                {
                  request_id: 22,
                  earliest_start_time: new Date('Dec 24 2021 10:00:00 GMT'),
                  latest_start_time: new Date('Dec 24 2021 15:00:00 GMT'),
                },
              ],
            },
          },
        ],
      },
      change_log: {
        create: [
          {
            log_id: 10,
            note: 'workshop request created',
            log_date: new Date('Dec 20 2020 12:24:00 GMT'),
          },
          {
            log_id: 11,
            note: 'workshop assigned',
            log_date: new Date('Dec 22 2020 18:24:00 GMT'),
          },
        ],
      },
    },
  })

  const workshop6 = await prisma.workshops.create({
    data: {
      workshop_id: 6,
      course_type: 'Course 201',
      requested_advisor: 'henri@email.net',
      backup_requested_advisor: 'john.doe@email.com',
      assigned_advisor: 'henri@email.net',
      workshop_location: 'Zoom',
      client_id: 5,
      open_air_id: 'OPID2354688',
      time_zone: 'CET',
      workshop_language: 'English',
      record_attendance: true,
      workshop_sessions: {
        create: [
          {
            workshop_session_id: 21,
            date_and_time: new Date('Nov 03 2021 12:00:00 GMT'),
            duration_in_hours: 2,
            zoom_link: 'www.zoom.com/user/abcdef1234',
            session_status: 'SCHEDULED',
            requested_start_times: {
              create: [
                {
                  request_id: 23,
                  earliest_start_time: new Date('Nov 03 2021 12:00:00 GMT'),
                  latest_start_time: new Date('Nov 03 2021 12:00:00 GMT'),
                },
              ],
            },
            session_notes: {
              create: [
                {
                  note_id: 4,
                  note: 'Head of Sales Andrea Slonik will be joining to observe process',
                },
              ],
            },
          },
          {
            workshop_session_id: 22,
            date_and_time: null,
            duration_in_hours: 2,
            zoom_link: 'www.zoom.com/user/abcdef1234',
            session_status: 'REQUESTED',
            requested_start_times: {
              create: [
                {
                  request_id: 24,
                  earliest_start_time: new Date('Nov 10 2021 12:00:00 GMT'),
                  latest_start_time: new Date('Nov 10 2021 12:00:00 GMT'),
                },
                {
                  request_id: 25,
                  earliest_start_time: new Date('Nov 10 2021 14:00:00 GMT'),
                  latest_start_time: new Date('Nov 10 2021 14:00:00 GMT'),
                },
              ],
            },
          },
          {
            workshop_session_id: 23,
            date_and_time: null,
            duration_in_hours: 2,
            zoom_link: 'www.zoom.com/user/abcdef1234',
            session_status: 'REQUESTED',
            requested_start_times: {
              create: [
                {
                  request_id: 26,
                  earliest_start_time: new Date('Nov 17 2021 12:30:00 GMT'),
                  latest_start_time: new Date('Nov 17 2021 12:30:00 GMT'),
                },
                {
                  request_id: 27,
                  earliest_start_time: new Date('Nov 17 2021 14:30:00 GMT'),
                  latest_start_time: new Date('Nov 17 2021 14:30:00 GMT'),
                },
              ],
            },
          },
          {
            workshop_session_id: 24,
            date_and_time: new Date('Nov 24 2021 12:00:00 GMT'),
            duration_in_hours: 2,
            zoom_link: 'www.zoom.com/user/abcdef1234',
            session_status: 'SCHEDULED',
            requested_start_times: {
              create: [
                {
                  request_id: 28,
                  earliest_start_time: new Date('Nov 24 2021 12:00:00 GMT'),
                  latest_start_time: new Date('Nov 24 2021 12:00:00 GMT'),
                },
              ],
            },
          },
        ],
      },
      workshop_notes: {
        create: [
          {
            note_id: 2,
            note: 'Client has requested previous template of training materials ABC be used',
          },
        ],
      },
      change_log: {
        create: [
          {
            log_id: 12,
            note: 'workshop request created',
            log_date: new Date('Mar 03 2021 13:39:00 GMT'),
          },
          {
            log_id: 13,
            note: 'session 1 and 4 confirmed, waiting for confirmation on 2 and 3',
            log_date: new Date('Mar 28 2021 20:47:00 GMT'),
          },
        ],
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

  const allWorkshopsSeeded = workshops.every((x) => x)
  if (!allWorkshopsSeeded) {
    console.log(`All workshops seeded: false`)
  }
}
