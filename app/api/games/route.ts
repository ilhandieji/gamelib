import { NextRequest, NextResponse } from "next/server";
import { GameSearchQuery, GameSearchService } from "@/lib/game-search-query";

const gameSearchService = new GameSearchService();

// GET /api/games - Advanced search and filtering for games
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = new GameSearchQuery(searchParams);
    const criteria = searchQuery.parse();

    const searchResult = await gameSearchService.searchGames(criteria);

    return NextResponse.json(searchResult);
  } catch (error) {
    console.error("Error fetching games:", error);
    return NextResponse.json(
      { error: "Failed to fetch games" },
      { status: 500 }
    );
  }
}