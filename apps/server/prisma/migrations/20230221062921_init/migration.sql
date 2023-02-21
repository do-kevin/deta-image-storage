-- CreateEnum
CREATE TYPE "UserKind" AS ENUM ('NORMAL', 'ADMIN', 'GOD');

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL DEFAULT nanoid(),
    "name" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploaderId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL DEFAULT nanoid(),
    "email" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255),
    "type" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255),
    "apiKey" VARCHAR(255),
    "kind" "UserKind" NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Image_id_key" ON "Image"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
