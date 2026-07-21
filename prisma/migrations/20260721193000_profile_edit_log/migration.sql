-- CreateTable
CREATE TABLE "profile_edits" (
    "id" SERIAL NOT NULL,
    "userid" BIGINT NOT NULL,
    "edited_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "front_before" VARCHAR(50),
    "back_before" VARCHAR(500),
    "front_after" VARCHAR(50),
    "back_after" VARCHAR(500),

    CONSTRAINT "profile_edits_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "profile_edits_edited_at_idx" ON "profile_edits"("edited_at");
