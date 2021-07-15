import { PrismaClient } from '@prisma/client'

// prisma seeding for workshops
// with relational fields for workshop_sessions,
// workshop_notes, and change_logs

export const seedWorkshops = async (prisma: PrismaClient) => {
  const workshop1 = await prisma.workshops.create({
    data: {
      //workshop_id: 1,
      course_id: 1,
      created_by: 1,
      cohort_name: 'NAM Cohort 1',
      workshop_coursework: {
        create: [
          {
            //workshop_coursework_id: 1,
            coursework_id: 1,
          },
          {
            //workshop_coursework_id: 2,
            coursework_id: 2,
          },
        ],
      },
      requested_advisor_id: 1,
      backup_requested_advisor_id: 2,
      assigned_advisor_id: 1,
      workshop_location: 'Zoom',
      workshop_region: 'NAM',
      client_id: 1,
      open_air_id: 'OPID23560h-jk',
      time_zone: 'EST',
      workshop_language: 'English',
      record_attendance: true,
      workshop_start_date: new Date('July 21 2021 11:00:00 GMT'),
      workshop_end_date: new Date('July 28 2021 11:00:00 GMT'),
      workshop_status: 'SCHEDULED',
      workshop_sessions: {
        create: [
          {
            //workshop_session_id: 1,
            session_name: 'Orientation',
            date_and_time: new Date('July 21 2021 11:00:00 GMT'),
            duration_in_hours: 0.5,
            zoom_link: 'www.zoom.com/user/abcdef1234',
            session_status: 'SCHEDULED',
            created_by: 1,
          },
          {
            //workshop_session_id: 2,
            session_name: 'Managers Meeting',
            date_and_time: new Date('July 21 2021 12:00:00 GMT'),
            duration_in_hours: 1,
            zoom_link: 'www.zoom.com/user/abcdef1234',
            session_status: 'SCHEDULED',
            created_by: 1,
          },
          {
            //workshop_session_id: 3,
            session_name: 'Session 1',
            date_and_time: new Date('July 22 2021 12:00:00 GMT'),
            duration_in_hours: 2,
            zoom_link: 'www.zoom.com/user/abcdef1234',
            session_status: 'SCHEDULED',
            created_by: 1,
          },
          {
            //workshop_session_id: 4,
            session_name: 'Session 2',
            date_and_time: new Date('July 23 2021 12:00:00 GMT'),
            duration_in_hours: 2,
            zoom_link: 'www.zoom.com/user/abcdef1234',
            session_status: 'SCHEDULED',
            created_by: 1,
          },
          {
            //workshop_session_id: 5,
            session_name: 'Session 3',
            date_and_time: new Date('July 24 2021 12:00:00 GMT'),
            duration_in_hours: 2,
            zoom_link: 'www.zoom.com/user/abcdef1234',
            session_status: 'SCHEDULED',
            created_by: 1,
          },
          {
            //workshop_session_id: 6,
            session_name: 'Session 4',
            date_and_time: new Date('July 25 2021 12:00:00 GMT'),
            duration_in_hours: 2,
            zoom_link: 'www.zoom.com/user/abcdef1234',
            session_status: 'SCHEDULED',
            created_by: 1,
          },
          {
            //workshop_session_id: 7,
            session_name: 'Managers Meeting',
            date_and_time: new Date('July 28 2021 11:00:00 GMT'),
            duration_in_hours: 1,
            zoom_link: 'www.zoom.com/user/abcdef1234',
            session_status: 'SCHEDULED',
            created_by: 1,
          },
        ],
      },
      workshop_notes: {
        create: [
          {
            //note_id: 1,
            note: 'Client has requested translation of XYZ materials',
            created_by: 1,
          },
        ],
      },
      change_log: {
        create: [
          {
            //log_id: 1,
            note: 'workshop request created',
            log_date: new Date('Nov 15 2020 15:23:00 GMT'),
          },
          {
            //log_id: 2,
            note: 'workshop assigned',
            log_date: new Date('Nov 17 2020 17:44:00 GMT'),
          },
        ],
      },
      in_person: false,
      participant_sign_up_link: `lM3U7oKg6R-VivCULBHi3
      xa_WOcacAydjIJ2e7FSF5
      pl_eDbFcX35vGT-VEu35f
      FI8CjTZo3itZFfOUlV-BY
      Vq8Cr1XxAd_bYhox4gQEk
      eCb_S7MKzsOM3iMURdrYE
      PN1z8r40lGdWgYrLuQK1X
      3CSh5Zkf5cY8f4NU7qg0y
      5Z3h5vlUaPuBAomSt-W9t
      l34QK9VLWbKfrwxWKIJhs`,
    },
  })

  const workshop2 = await prisma.workshops.create({
    data: {
      //workshop_id: 2,
      course_id: 1,
      created_by: 1,
      cohort_name: 'EMEA Cohort 1',
      workshop_coursework: {
        create: [
          {
            //workshop_coursework_id: 3,
            coursework_id: 1,
          },
          {
            //workshop_coursework_id: 4,
            coursework_id: 2,
          },
        ],
      },
      requested_advisor_id: 2,
      assigned_advisor_id: 2,
      workshop_location: 'Zoom',
      workshop_region: 'EMEA',
      client_id: 1,
      open_air_id: 'OPID23560h-jk',
      time_zone: 'CET',
      workshop_language: 'French',
      record_attendance: true,
      workshop_start_date: new Date('July 18 2021 6:00:00 GMT'),
      workshop_end_date: new Date('July 25 2021 06:00:00 GMT'),
      workshop_status: 'SCHEDULED',
      workshop_sessions: {
        create: [
          {
            //workshop_session_id: 8,
            session_name: 'Orientation',
            date_and_time: new Date('July 18 2021 6:00:00 GMT'),
            duration_in_hours: 0.5,
            zoom_link: 'www.zoom.com/user/abcdef1234',
            session_status: 'SCHEDULED',
            created_by: 1,
          },
          {
            //workshop_session_id: 9,
            session_name: 'Session 1',
            date_and_time: new Date('July 22 2021 06:00:00 GMT'),
            duration_in_hours: 2,
            zoom_link: 'www.zoom.com/user/abcdef1234',
            session_status: 'SCHEDULED',
            created_by: 1,
          },
          {
            //workshop_session_id: 10,
            session_name: 'Session 2',
            date_and_time: new Date('July 23 2021 06:00:00 GMT'),
            duration_in_hours: 2,
            zoom_link: 'www.zoom.com/user/abcdef1234',
            session_status: 'SCHEDULED',
            created_by: 1,
          },
          {
            //workshop_session_id: 11,
            session_name: 'Session 3',
            date_and_time: new Date('July 24 2021 06:00:00 GMT'),
            duration_in_hours: 2,
            zoom_link: 'www.zoom.com/user/abcdef1234',
            session_status: 'SCHEDULED',
            created_by: 1,
          },
          {
            //workshop_session_id: 12,
            session_name: 'Session 4',
            date_and_time: new Date('July 25 2021 06:00:00 GMT'),
            duration_in_hours: 2,
            zoom_link: 'www.zoom.com/user/abcdef1234',
            session_status: 'SCHEDULED',
            created_by: 1,
          },
        ],
      },
      workshop_notes: {
        create: [
          {
            //note_id: 2,
            note: 'Managers John Doe and Jane Doe will be joining as observers',
            created_by: 1,
          },

          {
            //note_id: 3,
            note: 'Participants Phil Lowe and Stacy Adams will be unavailable and joining workshop 3/ session 3 to make up for it',
            created_by: 1,
          },
        ],
      },
      change_log: {
        create: [
          {
            //log_id: 3,
            note: 'workshop request created',
            log_date: new Date('Jan 12 2021 15:23:00 GMT'),
          },
          {
            //log_id: 4,
            note: 'workshop assigned',
            log_date: new Date('Jan 29 2021 15:23:00 GMT'),
          },
        ],
      },
      in_person: false,
      participant_sign_up_link: `vMHR27InW5ajXhfL8LKs4
      J7JwHDqvDOV-CcBynrUTT
      XxxZkyrZ3JxvFC1D6Ja2K
      K5xtJYJQtSgHUu5jYD5OT
      erzEo55JU2ke6AgWWfzr_
      O6ljbwJ2aoVfqYGqyj1iY
      oQW14sb74-snXrTXsF-6n
      0YNGtu12M9yZDKgGKNTiQ
      3UbyhPjiGJfz_qssqHnYk
      _McnBYm0qzxev7MmFx6mu`,
    },
  })

  const workshop3 = await prisma.workshops.create({
    data: {
      //workshop_id: 3,
      course_id: 1,
      created_by: 1,
      cohort_name: 'APAC Cohort 6',
      workshop_coursework: {
        create: [
          {
            //workshop_coursework_id: 5,
            coursework_id: 3,
          },
        ],
      },
      requested_advisor_id: 3,
      assigned_advisor_id: 3,
      workshop_location: 'Teams',
      in_person: false,
      workshop_region: 'APAC',
      client_id: 1,
      open_air_id: 'OPID23560h-jk',
      time_zone: 'PT',
      workshop_language: 'Japanese',
      record_attendance: false,
      workshop_start_date: new Date('Aug 01 2021 07:00:00 GMT'),
      workshop_end_date: new Date('Aug 22 2021 07:00:00 GMT'),
      workshop_status: 'REQUESTED',
      workshop_sessions: {
        create: [
          {
            //workshop_session_id: 13,
            session_name: 'Foundational Concepts: Intro',
            date_and_time: new Date('Aug 01 2021 07:00:00 GMT'),
            duration_in_hours: 2,
            zoom_link: 'www.zoom.com/user/abcdef1234',
            session_status: 'REQUESTED',
            created_by: 1,
          },
          {
            //workshop_session_id: 14,
            session_name: 'Foundational Concepts: Explore Further',
            date_and_time: new Date('Aug 08 2021 07:00:00 GMT'),
            duration_in_hours: 2,
            zoom_link: 'www.zoom.com/user/abcdef1234',
            session_status: 'REQUESTED',
            created_by: 1,
          },
          {
            //workshop_session_id: 15,
            session_name: 'Foundational Concepts: Real-World Applications',
            date_and_time: new Date('Aug 15 2021 07:00:00 GMT'),
            duration_in_hours: 2,
            zoom_link: 'www.zoom.com/user/abcdef1234',
            session_status: 'REQUESTED',
            created_by: 1,
          },
          {
            //workshop_session_id: 16,
            session_name: 'Foundational Concepts: Summary & Recap',
            date_and_time: new Date('Aug 22 2021 07:00:00 GMT'),
            duration_in_hours: 2,
            zoom_link: 'www.zoom.com/user/abcdef1234',
            session_status: 'REQUESTED',
            created_by: 1,
          },
        ],
      },
      change_log: {
        create: [
          {
            //log_id: 5,
            note: 'workshop request created',
            log_date: new Date('Feb 03 2021 13:01:00 GMT'),
          },
          {
            //log_id: 6,
            note: 'workshop assigned',
            log_date: new Date('Feb 10 2021 16:56:00 GMT'),
          },
        ],
      },
      participant_sign_up_link: `61V6omeJzpKZarKyMiS5B
      qGHFLzk8B4GLHWQS3A2zu
      d_7dj6nweiXQT9vJ2swmq
      ur4krNylBV75SDrxeL22p
      nQjCW6Q3oC1ZvG2uY8lTE
      mlkRxB_o-E0BIoO6Ffc70
      cI1CcWrB-j7YqLXmZdi2U
      9kqYg_CkctCOMmT36Hv9m
      io6wIRsRhvjRPO0gvTve6
      8emBSGGweqognGZ2s0iLL`,
    },
  })

  const workshop4 = await prisma.workshops.create({
    data: {
      //workshop_id: 4,
      course_id: 1,
      created_by: 1,
      cohort_name: 'NAM 2021 Training',
      workshop_coursework: {
        create: [
          {
            //workshop_coursework_id: 6,
            coursework_id: 4,
          },
        ],
      },
      requested_advisor_id: 2,
      backup_requested_advisor_id: 1,
      assigned_advisor_id: 1,
      workshop_location: 'Zoom',
      workshop_region: 'NAM',
      client_id: 3,
      open_air_id: 'OPID236789',
      time_zone: 'EST',
      workshop_language: 'English',
      record_attendance: false,
      in_person: false,
      workshop_status: 'HOLD_A',
      workshop_start_date: new Date('Oct 19 2021 14:00:00 GMT'),
      workshop_end_date: new Date('Oct 30 2021 14:00:00 GMT'),
      workshop_sessions: {
        create: [
          {
            //workshop_session_id: 17,
            session_name: 'Orientation',
            date_and_time: new Date('Oct 19 2021 14:00:00 GMT'),
            duration_in_hours: 0.5,
            zoom_link: 'www.zoom.com/user/abcdef1234',
            session_status: 'SCHEDULED',
            created_by: 1,
          },
          {
            //workshop_session_id: 18,
            session_name: 'Session 1',
            date_and_time: new Date('Oct 20 2021 14:00:00 GMT'),
            duration_in_hours: 1.5,
            zoom_link: 'www.zoom.com/user/abcdef1234',
            session_status: 'SCHEDULED',
            created_by: 1,
          },
          {
            //workshop_session_id: 19,
            session_name: 'Session 2',
            date_and_time: new Date('Oct 22 2021 14:00:00 GMT'),
            duration_in_hours: 1.5,
            zoom_link: 'www.zoom.com/user/abcdef1234',
            session_status: 'SCHEDULED',
            created_by: 1,
          },
          {
            //workshop_session_id: 20,
            session_name: 'Session 3',
            date_and_time: new Date('Oct 24 2021 14:00:00 GMT'),
            duration_in_hours: 1.5,
            zoom_link: 'www.zoom.com/user/abcdef1234',
            session_status: 'HOLD_A',
            created_by: 1,
          },
          {
            //workshop_session_id: 21,
            session_name: 'Session 4',
            date_and_time: new Date('Oct 26 2021 14:00:00 GMT'),
            duration_in_hours: 1.5,
            zoom_link: 'www.zoom.com/user/abcdef1234',
            session_status: 'SCHEDULED',
            created_by: 1,
          },
          {
            //workshop_session_id: 22,
            session_name: 'Managers Meeting',
            date_and_time: new Date('Oct 30 2021 14:00:00 GMT'),
            duration_in_hours: 1,
            zoom_link: 'www.zoom.com/user/abcdef1234',
            session_status: 'SCHEDULED',
            created_by: 1,
          },
        ],
      },
      change_log: {
        create: [
          {
            //log_id: 7,
            note: 'workshop request created',
            log_date: new Date('Nov 01 2020 14:03:00 GMT'),
          },
          {
            //log_id: 8,
            note: 'workshop assigned',
            log_date: new Date('Nov 17 2020 16:16:00 GMT'),
          },
          {
            //log_id: 9,
            note: 'session 3 timing conflict for client. Placed in Hold while gathering new dates',
            log_date: new Date('Nov 18 2020 11:34:00 GMT'),
          },
        ],
      },
      participant_sign_up_link: `U_AzcEO3rsqk8FKpxPgmV
      IiE06SXzwvwxWENIZvcdW
      _owgBOJ_DfnUF5K6O01rB
      0I0bgp0P14pZLsRz6TUrT
      apUy5ukDt6swY0ttthTFa
      FYxQCHLKLh-WJgRaDfY7Z
      9ALSeW8K1m6obbDGxJ4oS
      drIKjOBVBSispntfqIVA5
      zZe-GGYz7DF37LQpJ4Lj7
      W7SlWLuaB7ZbEhvFaf2fx`,
    },
  })

  const workshop5 = await prisma.workshops.create({
    data: {
      //workshop_id: 5,
      course_id: 4,
      created_by: 2,
      cohort_name: 'LATAM Follow-up Cohort 8SE',
      workshop_coursework: {
        create: [
          {
            //workshop_coursework_id: 7,
            coursework_id: 5,
          },
        ],
      },
      requested_advisor_id: 4,
      assigned_advisor_id: null,
      workshop_location: 'Sao Paulo, Brazil',
      workshop_region: 'LATAM',
      client_id: 4,
      open_air_id: 'OPID23560h-jk',
      time_zone: 'EST',
      workshop_language: 'Spanish',
      record_attendance: true,
      in_person: false,
      workshop_start_date: new Date('Dec 03 2021 13:00:00 GMT'),
      workshop_end_date: new Date('Dec 24 2021 11:00:00 GMT'),
      workshop_status: 'REQUESTED',
      workshop_sessions: {
        create: [
          {
            //workshop_session_id: 23,
            session_name: 'Session 1',
            date_and_time: new Date('Dec 03 2021 13:00:00 GMT'),
            duration_in_hours: 2,
            zoom_link: 'www.zoom.com/user/abcdef1234',
            session_status: 'REQUESTED',
            created_by: 2,
          },
          {
            //workshop_session_id: 24,
            session_name: 'Session 2',
            date_and_time: new Date('Dec 10 2021 13:00:00 GMT'),
            duration_in_hours: 2,
            zoom_link: 'www.zoom.com/user/abcdef1234',
            session_status: 'REQUESTED',
            created_by: 2,
          },
          {
            //workshop_session_id: 25,
            session_name: 'Session 3',
            date_and_time: new Date('Dec 17 2021 13:00:00 GMT'),
            duration_in_hours: 2,
            zoom_link: 'www.zoom.com/user/abcdef1234',
            session_status: 'REQUESTED',
            created_by: 2,
          },
          {
            //workshop_session_id: 26,
            session_name: 'Session 4',
            date_and_time: new Date('Dec 24 2021 11:00:00 GMT'),
            duration_in_hours: 2,
            zoom_link: 'www.zoom.com/user/abcdef1234',
            session_status: 'REQUESTED',
            created_by: 2,
          },
        ],
      },
      change_log: {
        create: [
          {
            //log_id: 10,
            note: 'workshop request created',
            log_date: new Date('Dec 20 2020 12:24:00 GMT'),
          },
          {
            //log_id: 11,
            note: 'workshop location changed',
            log_date: new Date('Dec 22 2020 18:24:00 GMT'),
          },
        ],
      },
      participant_sign_up_link: `B9DXtbEoul5GFwibcADWy
      wM_Ef8S4UPt58xRkFsYEN
      ApuGlt6CwaV6HDsB9OrW6
      hhcpe1DaYugLDw_LA4yCL
      ivz0CcO-Xc6o6bNB6wrN_
      2BakRz8fhmtTtG8bduwUD
      UnKCtM6FOJ1kZOcEdIWYz
      X8ejyD4ALbEnu3CsvlSUs
      xCyEBNHQme6HA7Hip4L3P
      NIki1NrhD-6Qpd3Cjq2ki`,
    },
  })

  const workshop6 = await prisma.workshops.create({
    data: {
      //workshop_id: 6,
      course_id: 3,
      created_by: 1,
      cohort_name: 'EMEA Crossover Group B',
      workshop_coursework: {
        create: [
          {
            //workshop_coursework_id: 8,
            coursework_id: 4,
          },
        ],
      },
      requested_advisor_id: 2,
      backup_requested_advisor_id: 1,
      assigned_advisor_id: 2,
      workshop_location: 'Zoom',
      workshop_region: 'EMEA',
      client_id: 5,
      open_air_id: 'OPID2354688',
      time_zone: 'CET',
      workshop_language: 'English',
      record_attendance: true,
      in_person: false,
      workshop_status: 'REQUESTED',
      workshop_start_date: new Date('Nov 01 2021 12:00:00 GMT'),
      workshop_end_date: new Date('Nov 26 2021 12:00:00 GMT'),
      workshop_sessions: {
        create: [
          {
            //workshop_session_id: 27,
            session_name: 'Orientation',
            date_and_time: new Date('Nov 01 2021 12:00:00 GMT'),
            duration_in_hours: 0.5,
            zoom_link: 'www.zoom.com/user/abcdef1234',
            session_status: 'SCHEDULED',
            created_by: 1,
          },
          {
            //workshop_session_id: 28,
            session_name: 'Managers Meeting',
            date_and_time: new Date('Nov 02 2021 12:00:00 GMT'),
            duration_in_hours: 1,
            zoom_link: 'www.zoom.com/user/abcdef1234',
            session_status: 'SCHEDULED',
            created_by: 1,
          },
          {
            //workshop_session_id: 29,
            session_name: 'Part 1: Teach',
            date_and_time: new Date('Nov 03 2021 12:00:00 GMT'),
            duration_in_hours: 2,
            zoom_link: 'www.zoom.com/user/abcdef1234',
            session_status: 'SCHEDULED',
            created_by: 1,
          },
          {
            //workshop_session_id: 30,
            session_name: 'Part 2: Tailor',
            date_and_time: null,
            duration_in_hours: 2,
            zoom_link: 'www.zoom.com/user/abcdef1234',
            session_status: 'REQUESTED',
            created_by: 1,
          },
          {
            //workshop_session_id: 31,
            session_name: 'Part 3: Take Control',
            date_and_time: null,
            duration_in_hours: 2,
            zoom_link: 'www.zoom.com/user/abcdef1234',
            session_status: 'REQUESTED',
            created_by: 1,
          },
          {
            //workshop_session_id: 32,
            session_name: 'Part 4: Constructive Tension',
            date_and_time: new Date('Nov 24 2021 12:00:00 GMT'),
            duration_in_hours: 2,
            zoom_link: 'www.zoom.com/user/abcdef1234',
            session_status: 'SCHEDULED',
            created_by: 1,
          },
          {
            //workshop_session_id: 33,
            session_name: 'Managers Meeting 2',
            date_and_time: new Date('Nov 26 2021 12:00:00 GMT'),
            duration_in_hours: 1,
            zoom_link: 'www.zoom.com/user/abcdef1234',
            session_status: 'SCHEDULED',
            created_by: 1,
          },
        ],
      },
      workshop_notes: {
        create: [
          {
            //note_id: 4,
            note: 'Client has requested previous template of training materials ABC be used',
            created_by: 1,
          },
          {
            //note_id: 5,
            note: 'Head of Sales Andrea Slonik will be joining to observe process',
            created_by: 1,
          },
        ],
      },
      change_log: {
        create: [
          {
            //log_id: 12,
            note: 'workshop request created',
            log_date: new Date('Mar 03 2021 13:39:00 GMT'),
          },
          {
            //log_id: 13,
            note: 'session 1 and 4 confirmed, waiting for confirmation on 2 and 3',
            log_date: new Date('Mar 28 2021 20:47:00 GMT'),
          },
        ],
      },
      participant_sign_up_link: `2qHk6rV91iKvX2fCE3l7y
      DgMATBkRBEOPwB8ZKCs-d
      jYfDq72HEdfXCDnQJgqrG
      GnPIUHjSNPF16_aHeEG-s
      ssh15JeX0JQcjWIlO_53o
      c2wcF7Jivv8BEfV_aO1nY
      6uZkkzG-gpt00RsqmFEp3
      1b7O0HSmxvp02OS2WMdgv
      P9vsD6vjYOxTvQXufnmuZ
      8A_P-wkcZ3weSehMUwtqJ`,
    },
  })

  const deletedWorkshop = await prisma.workshops.create({
    data: {
      //workshop_id: 7,
      course_id: 1,
      created_by: 3,
      cohort_name: 'Canada Advance Team 2020-2021',
      workshop_coursework: {
        create: [
          {
            //workshop_coursework_id: 9,
            coursework_id: 3,
          },
        ],
      },
      requested_advisor_id: 1,
      backup_requested_advisor_id: null,
      assigned_advisor_id: null,
      workshop_location: 'Ontario',
      workshop_region: 'NAM',
      client_id: 1,
      open_air_id: 'OPID123456',
      time_zone: 'EST',
      workshop_language: 'English',
      record_attendance: false,
      in_person: true,
      workshop_status: 'CANCELLED',
      workshop_start_date: new Date('Mar 12 2022 12:00:00 GMT'),
      workshop_end_date: new Date('Mar 12 2022 12:00:00 GMT'),
      deleted: true,

      change_log: {
        create: [
          {
            //log_id: 14,
            note: 'workshop request created',
            log_date: new Date('Mar 03 2021 13:39:00 GMT'),
          },
          {
            //log_id: 15,
            note: 'workshop deleted',
            log_date: new Date('Mar 28 2021 20:47:00 GMT'),
          },
        ],
      },
      participant_sign_up_link: `6r8ev80i3ruPolZEBQUq8
      -p_N8Pz3yXsZZ8w_2dXLD
      2vTOYnEg8ItRye_xkpOv0
      es-6LCr1buAvvgEoj6lMX
      WUsqW7_u-IPmtbOedGZUH
      03GkQmnkPI66W45jTYbr0
      eoSPn2rjS9Bhh8oH_VPa4
      mO12Cje7X5ybev6_ptkZe
      2Jx2SJuLRszWeuW6kMVRX
      5iEEkueqk0avhj_TURCOA`,
    },
  })

  const workshops = [
    workshop1,
    workshop2,
    workshop3,
    workshop4,
    workshop5,
    workshop6,
    deletedWorkshop,
  ]

  const allWorkshopsSeeded = workshops.every((x) => x)
  if (!allWorkshopsSeeded) {
    console.log(`All workshops seeded: false`)
  }
}
