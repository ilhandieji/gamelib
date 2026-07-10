/*
  Warnings:

  - The `platforms` column on the `Games` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `stores` column on the `Games` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `developers` column on the `Games` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `genres` column on the `Games` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `publishers` column on the `Games` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `tags` column on the `Games` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `esrb_rating` column on the `Games` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `short_screenshots` column on the `Games` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `metacritic_platforms` column on the `Games` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `parent_platforms` column on the `Games` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `alternative_names` column on the `Games` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `tba` column on the `Games` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Games" ADD COLUMN     "added" INTEGER,
ADD COLUMN     "added_by_status" JSONB,
ADD COLUMN     "parents_count" INTEGER,
ADD COLUMN     "rating" DOUBLE PRECISION,
ADD COLUMN     "rating_top" DOUBLE PRECISION,
ADD COLUMN     "ratings" JSONB,
ADD COLUMN     "ratings_count" INTEGER,
ADD COLUMN     "reactions" JSONB,
ADD COLUMN     "reddit_count" INTEGER,
ADD COLUMN     "reviews_count" INTEGER,
ADD COLUMN     "reviews_text_count" INTEGER,
ADD COLUMN     "twitch_count" INTEGER,
ADD COLUMN     "updated" TIMESTAMP(3),
ADD COLUMN     "youtube_count" INTEGER,
DROP COLUMN "platforms",
ADD COLUMN     "platforms" JSONB,
DROP COLUMN "stores",
ADD COLUMN     "stores" JSONB,
DROP COLUMN "developers",
ADD COLUMN     "developers" JSONB,
DROP COLUMN "genres",
ADD COLUMN     "genres" JSONB,
DROP COLUMN "publishers",
ADD COLUMN     "publishers" JSONB,
DROP COLUMN "tags",
ADD COLUMN     "tags" JSONB,
DROP COLUMN "esrb_rating",
ADD COLUMN     "esrb_rating" JSONB,
DROP COLUMN "short_screenshots",
ADD COLUMN     "short_screenshots" JSONB,
DROP COLUMN "metacritic_platforms",
ADD COLUMN     "metacritic_platforms" JSONB,
DROP COLUMN "parent_platforms",
ADD COLUMN     "parent_platforms" JSONB,
DROP COLUMN "alternative_names",
ADD COLUMN     "alternative_names" JSONB,
DROP COLUMN "tba",
ADD COLUMN     "tba" BOOLEAN;
