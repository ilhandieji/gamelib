/*
  Warnings:

  - The primary key for the `Games` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Games` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[rawg_id]` on the table `Games` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Games" DROP CONSTRAINT "Games_pkey",
DROP COLUMN "id",
ADD COLUMN     "rawg_id" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Games_rawg_id_key" ON "Games"("rawg_id");
