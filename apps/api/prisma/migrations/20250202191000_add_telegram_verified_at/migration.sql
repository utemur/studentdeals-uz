-- AlterTable
ALTER TABLE "users" ADD COLUMN "telegramVerifiedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "users_telegramVerifiedAt_idx" ON "users"("telegramVerifiedAt");

