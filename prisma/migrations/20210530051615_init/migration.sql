-- CreateEnum
CREATE TYPE "session_status_enum" AS ENUM ('REQUESTED', 'SCHEDULED', 'COMPLETED', 'HOLD A', 'HOLD B');

-- CreateTable
CREATE TABLE "advisors" (
    "email" VARCHAR(255) NOT NULL,
    "first_name" VARCHAR(255) NOT NULL,
    "last_name" VARCHAR(255) NOT NULL,

    PRIMARY KEY ("email")
);

-- CreateTable
CREATE TABLE "change_log" (
    "log_id" SERIAL NOT NULL,
    "workshop" INTEGER NOT NULL,
    "note" TEXT NOT NULL,
    "log_date" TIMESTAMPTZ(6) NOT NULL,

    PRIMARY KEY ("log_id")
);

-- CreateTable
CREATE TABLE "clients" (
    "client_id" SERIAL NOT NULL,
    "client_name" VARCHAR(255) NOT NULL,
    "business_unit" VARCHAR(255),

    PRIMARY KEY ("client_id")
);

-- CreateTable
CREATE TABLE "courses" (
    "course_name" VARCHAR(255) NOT NULL,
    "course_description" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "virtual_course" BOOLEAN NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("course_name")
);

-- CreateTable
CREATE TABLE "languages" (
    "language_id" SERIAL NOT NULL,
    "advisor" VARCHAR(255) NOT NULL,
    "advisor_language" VARCHAR(255) NOT NULL,

    PRIMARY KEY ("language_id")
);

-- CreateTable
CREATE TABLE "manager_assignments" (
    "assignment_id" SERIAL NOT NULL,
    "workshop_id" INTEGER NOT NULL,
    "manager" VARCHAR(255) NOT NULL,
    "active" BOOLEAN NOT NULL,

    PRIMARY KEY ("assignment_id")
);

-- CreateTable
CREATE TABLE "managers" (
    "first_name" VARCHAR(255) NOT NULL,
    "last_name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "email_password" VARCHAR(255) NOT NULL,

    PRIMARY KEY ("email")
);

-- CreateTable
CREATE TABLE "regions" (
    "region_id" SERIAL NOT NULL,
    "advisor_region" VARCHAR(255) NOT NULL,
    "advisor" VARCHAR(255) NOT NULL,

    PRIMARY KEY ("region_id")
);

-- CreateTable
CREATE TABLE "unavailable_days" (
    "unavailable_id" SERIAL NOT NULL,
    "advisor" VARCHAR(255) NOT NULL,
    "day_unavailable" DATE NOT NULL,
    "note" TEXT,

    PRIMARY KEY ("unavailable_id")
);

-- CreateTable
CREATE TABLE "workshop_notes" (
    "note_id" SERIAL NOT NULL,
    "workshop_id" INTEGER NOT NULL,
    "note" TEXT NOT NULL,

    PRIMARY KEY ("note_id")
);

-- CreateTable
CREATE TABLE "workshop_sessions" (
    "workshop_session_id" SERIAL NOT NULL,
    "workshop_id" INTEGER NOT NULL,
    "date_and_time" TIMESTAMPTZ(6),
    "session_status" "session_status_enum" NOT NULL,
    "duration_in_hours" DECIMAL(2,1) NOT NULL,
    "zoom_link" VARCHAR(255),

    PRIMARY KEY ("workshop_session_id")
);

-- CreateTable
CREATE TABLE "workshops" (
    "workshop_id" SERIAL NOT NULL,
    "course_type" VARCHAR(255) NOT NULL,
    "requested_advisor" VARCHAR(255) NOT NULL,
    "backup_requested_advisor" VARCHAR(255),
    "assigned_advisor" VARCHAR(255),
    "workshop_location" VARCHAR(255) NOT NULL,
    "client_id" INTEGER NOT NULL,
    "open_air_id" VARCHAR(255) NOT NULL,
    "time_zone" VARCHAR(10) NOT NULL,
    "workshop_language" VARCHAR(255) NOT NULL,
    "record_attendance" BOOLEAN NOT NULL,

    PRIMARY KEY ("workshop_id")
);

-- CreateTable
CREATE TABLE "requested_start_times" (
    "request_id" SERIAL NOT NULL,
    "workshop_session_id" INTEGER NOT NULL,
    "earliest_start_time" TIMESTAMPTZ(6) NOT NULL,
    "latest_start_time" TIMESTAMPTZ(6) NOT NULL,

    PRIMARY KEY ("request_id")
);

-- CreateTable
CREATE TABLE "session_notes" (
    "note_id" SERIAL NOT NULL,
    "workshop_session_id" INTEGER NOT NULL,
    "note" TEXT NOT NULL,

    PRIMARY KEY ("note_id")
);

-- AddForeignKey
ALTER TABLE "regions" ADD FOREIGN KEY ("advisor") REFERENCES "advisors"("email") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requested_start_times" ADD FOREIGN KEY ("workshop_session_id") REFERENCES "workshop_sessions"("workshop_session_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workshop_notes" ADD FOREIGN KEY ("workshop_id") REFERENCES "workshops"("workshop_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workshops" ADD FOREIGN KEY ("assigned_advisor") REFERENCES "advisors"("email") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workshops" ADD FOREIGN KEY ("backup_requested_advisor") REFERENCES "advisors"("email") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workshops" ADD FOREIGN KEY ("client_id") REFERENCES "clients"("client_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workshops" ADD FOREIGN KEY ("course_type") REFERENCES "courses"("course_name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workshops" ADD FOREIGN KEY ("requested_advisor") REFERENCES "advisors"("email") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manager_assignments" ADD FOREIGN KEY ("manager") REFERENCES "managers"("email") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manager_assignments" ADD FOREIGN KEY ("workshop_id") REFERENCES "workshops"("workshop_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_notes" ADD FOREIGN KEY ("workshop_session_id") REFERENCES "workshop_sessions"("workshop_session_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workshop_sessions" ADD FOREIGN KEY ("workshop_id") REFERENCES "workshops"("workshop_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "languages" ADD FOREIGN KEY ("advisor") REFERENCES "advisors"("email") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "change_log" ADD FOREIGN KEY ("workshop") REFERENCES "workshops"("workshop_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unavailable_days" ADD FOREIGN KEY ("advisor") REFERENCES "advisors"("email") ON DELETE CASCADE ON UPDATE CASCADE;
