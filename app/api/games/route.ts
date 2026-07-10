import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

// GET /api/games - Get a paginated list of games
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parsedQuery = paginationQuerySchema.safeParse({
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
    });

    const page = parsedQuery.success ? parsedQuery.data.page : 1;
    const limit = parsedQuery.success ? parsedQuery.data.limit : 10;
    const offset = (page - 1) * limit;
    const slug = searchParams.get("slug");
    const filters = slug ? { slug } : {};

    const [games, totalGames] = await Promise.all([
      prisma.games.findMany({
        where: filters,
        skip: offset,
        take: limit,
        orderBy: { rawg_id: "asc" },
      }),
      prisma.games.count({ where: filters }),
    ]);

    return NextResponse.json({
      games,
      pagination: {
        page,
        limit,
        totalGames,
        totalPages: Math.ceil(totalGames / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching games:", error);
    return NextResponse.json(
      { error: "Failed to fetch games" },
      { status: 500 }
    );
  }
}