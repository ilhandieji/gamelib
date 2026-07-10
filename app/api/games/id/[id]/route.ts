import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const routeParams = await params;
    const requestedGameId = Number(routeParams.id);

    if (!Number.isInteger(requestedGameId) || requestedGameId <= 0) {
      return NextResponse.json(
        { error: "The game id must be a positive integer." },
        { status: 400 }
      );
    }

    const game = await prisma.games.findUnique({
      where: { rawg_id: requestedGameId },
    });

    if (!game) {
      return NextResponse.json(
        { error: "No game found for the provided id." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      game,
      requestedRawgId: requestedGameId,
    });
  } catch (error) {
    console.error("Error fetching game details:", error);
    return NextResponse.json(
      { error: "Failed to fetch game details" },
      { status: 500 }
    );
  }
}
