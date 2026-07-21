-- CreateTable
CREATE TABLE "pagedescription" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "description" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "pagedescription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pageinformation" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "information" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "pageinformation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teamprofile" (
    "userid" BIGINT NOT NULL,
    "frontdesc" VARCHAR(50),
    "backdesc" VARCHAR(500),

    CONSTRAINT "teamprofile_pkey" PRIMARY KEY ("userid")
);

-- CreateTable
CREATE TABLE "msgs" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "count" BIGINT NOT NULL DEFAULT 0,

    CONSTRAINT "msgs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "todaymsgs" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "count" BIGINT NOT NULL DEFAULT 0,

    CONSTRAINT "todaymsgs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "todayjoins" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "count" BIGINT NOT NULL DEFAULT 0,

    CONSTRAINT "todayjoins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partners" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "logo_url" TEXT NOT NULL DEFAULT '',
    "tagline" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "discord_invite_code" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "partners_pkey" PRIMARY KEY ("id")
);
