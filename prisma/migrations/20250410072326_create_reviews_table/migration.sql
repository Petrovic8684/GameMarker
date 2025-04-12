-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('story', 'easy', 'medium', 'hard', 'extra_hard', 'nightmare');

-- CreateTable
CREATE TABLE "Review" (
    "id" SERIAL NOT NULL,
    "rating" DECIMAL(65,30),
    "comment" TEXT,
    "completed" BOOLEAN,
    "platform" TEXT,
    "difficulty" "Difficulty",
    "gameId" INTEGER NOT NULL,
    "createdBy" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Review_createdBy_idx" ON "Review"("createdBy");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
