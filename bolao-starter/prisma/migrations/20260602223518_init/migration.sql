-- CreateEnum
CREATE TYPE "MatchStage" AS ENUM ('GRUPOS', 'OITAVAS', 'QUARTAS', 'SEMI', 'FINAL');

-- CreateEnum
CREATE TYPE "MatchStatus" AS ENUM ('SCHEDULED', 'LIVE', 'FINISHED');

-- CreateTable
CREATE TABLE "Pool" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pool_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Participant" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "poolId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Participant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Match" (
    "id" SERIAL NOT NULL,
    "homeTeam" TEXT NOT NULL,
    "awayTeam" TEXT NOT NULL,
    "stage" "MatchStage" NOT NULL,
    "kickoffAt" TIMESTAMP(3) NOT NULL,
    "homeScore" INTEGER,
    "awayScore" INTEGER,
    "status" "MatchStatus" NOT NULL DEFAULT 'SCHEDULED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Guess" (
    "id" SERIAL NOT NULL,
    "poolId" INTEGER NOT NULL,
    "participantId" INTEGER NOT NULL,
    "matchId" INTEGER NOT NULL,
    "homeScore" INTEGER NOT NULL,
    "awayScore" INTEGER NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Guess_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pool_code_key" ON "Pool"("code");

-- CreateIndex
CREATE INDEX "Participant_poolId_idx" ON "Participant"("poolId");

-- CreateIndex
CREATE UNIQUE INDEX "Participant_email_poolId_key" ON "Participant"("email", "poolId");

-- CreateIndex
CREATE INDEX "Guess_poolId_idx" ON "Guess"("poolId");

-- CreateIndex
CREATE INDEX "Guess_matchId_idx" ON "Guess"("matchId");

-- CreateIndex
CREATE UNIQUE INDEX "Guess_participantId_matchId_poolId_key" ON "Guess"("participantId", "matchId", "poolId");

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_poolId_fkey" FOREIGN KEY ("poolId") REFERENCES "Pool"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guess" ADD CONSTRAINT "Guess_poolId_fkey" FOREIGN KEY ("poolId") REFERENCES "Pool"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guess" ADD CONSTRAINT "Guess_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guess" ADD CONSTRAINT "Guess_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;
