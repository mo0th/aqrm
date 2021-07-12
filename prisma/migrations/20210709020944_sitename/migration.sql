/*
  Warnings:

  - You are about to drop the column `site` on the `Site` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Site` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Site` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Site.site_unique";

-- AlterTable
ALTER TABLE "Site" DROP COLUMN "site",
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Site.name_unique" ON "Site"("name");
