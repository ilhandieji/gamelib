/*
  Warnings:

  - You are about to drop the column `added` on the `Games` table. All the data in the column will be lost.
  - You are about to drop the column `added_by_status` on the `Games` table. All the data in the column will be lost.
  - You are about to drop the column `creators_count` on the `Games` table. All the data in the column will be lost.
  - You are about to drop the column `parents_count` on the `Games` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `Games` table. All the data in the column will be lost.
  - You are about to drop the column `rating_top` on the `Games` table. All the data in the column will be lost.
  - You are about to drop the column `ratings` on the `Games` table. All the data in the column will be lost.
  - You are about to drop the column `ratings_count` on the `Games` table. All the data in the column will be lost.
  - You are about to drop the column `reactions` on the `Games` table. All the data in the column will be lost.
  - You are about to drop the column `reddit_count` on the `Games` table. All the data in the column will be lost.
  - You are about to drop the column `reviews_count` on the `Games` table. All the data in the column will be lost.
  - You are about to drop the column `reviews_text_count` on the `Games` table. All the data in the column will be lost.
  - You are about to drop the column `twitch_count` on the `Games` table. All the data in the column will be lost.
  - You are about to drop the column `updated` on the `Games` table. All the data in the column will be lost.
  - You are about to drop the column `youtube_count` on the `Games` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Games" DROP COLUMN "added",
DROP COLUMN "added_by_status",
DROP COLUMN "creators_count",
DROP COLUMN "parents_count",
DROP COLUMN "rating",
DROP COLUMN "rating_top",
DROP COLUMN "ratings",
DROP COLUMN "ratings_count",
DROP COLUMN "reactions",
DROP COLUMN "reddit_count",
DROP COLUMN "reviews_count",
DROP COLUMN "reviews_text_count",
DROP COLUMN "twitch_count",
DROP COLUMN "updated",
DROP COLUMN "youtube_count",
ALTER COLUMN "platforms" SET DATA TYPE TEXT,
ALTER COLUMN "stores" SET DATA TYPE TEXT,
ALTER COLUMN "developers" SET DATA TYPE TEXT,
ALTER COLUMN "genres" SET DATA TYPE TEXT,
ALTER COLUMN "publishers" SET DATA TYPE TEXT,
ALTER COLUMN "tags" SET DATA TYPE TEXT,
ALTER COLUMN "esrb_rating" SET DATA TYPE TEXT,
ALTER COLUMN "short_screenshots" SET DATA TYPE TEXT,
ALTER COLUMN "metacritic_platforms" SET DATA TYPE TEXT,
ALTER COLUMN "parent_platforms" SET DATA TYPE TEXT,
ALTER COLUMN "alternative_names" SET DATA TYPE TEXT,
ALTER COLUMN "tba" SET DATA TYPE TEXT;
