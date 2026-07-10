import { prisma } from "@/lib/prisma";

type GameSearchParams = {
  query?: string | null;
  slug?: string | null;
  releaseMonth?: string | null;
  releaseYear?: string | null;
  metacriticMin?: string | null;
  metacriticOnly?: string | null;
  platforms?: string | null;
  stores?: string | null;
  developers?: string | null;
  publishers?: string | null;
  genres?: string | null;
  tags?: string | null;
  sortBy?: string | null;
  sortOrder?: string | null;
  page?: string | null;
  limit?: string | null;
};

export class GameSearchService {
  constructor(private readonly prismaClient = prisma) {}

  async searchGames(params: GameSearchParams) {
    const page = this.parsePositiveInteger(params.page, 1) ?? 1;
    const requestedLimit = params.limit?.trim();
    const shouldReturnAllResults = !requestedLimit || requestedLimit === "all";
    const limit = shouldReturnAllResults
      ? undefined
      : this.parsePositiveInteger(params.limit, 20) ?? 20;
    const offset = limit ? (page - 1) * limit : 0;

    const whereClause = this.buildWhereClause(params);
    const orderBy = this.buildOrderBy(params.sortBy, params.sortOrder);

    const [games, totalGames] = await Promise.all([
      this.prismaClient.games.findMany({
        where: whereClause,
        orderBy,
        skip: limit ? offset : undefined,
        take: limit,
      }),
      this.prismaClient.games.count({ where: whereClause }),
    ]);

    const effectiveLimit = limit ?? totalGames;

    return {
      games,
      pagination: {
        page,
        limit: effectiveLimit,
        totalGames,
        totalPages: limit ? Math.ceil(totalGames / limit) : 1,
      },
    };
  }

  private buildWhereClause(params: GameSearchParams) {
    const whereClause: Record<string, unknown> = {};

    const searchQuery = params.query?.trim() || params.slug?.trim();
    if (searchQuery) {
      whereClause.OR = [
        { slug: { contains: searchQuery, mode: "insensitive" } },
        { name: { contains: searchQuery, mode: "insensitive" } },
        { name_original: { contains: searchQuery, mode: "insensitive" } },
        { alternative_names: { contains: searchQuery, mode: "insensitive" } },
      ];
    }

    if (params.releaseMonth || params.releaseYear) {
      const releaseMonth = this.parsePositiveInteger(params.releaseMonth, null);
      const releaseYear = this.parsePositiveInteger(params.releaseYear, null);

      if (releaseMonth && releaseYear) {
        const startDate = new Date(Date.UTC(releaseYear, releaseMonth - 1, 1));
        const endDate = new Date(Date.UTC(releaseYear, releaseMonth, 1));
        whereClause.released = {
          gte: startDate,
          lt: endDate,
        };
      } else if (releaseYear) {
        const startDate = new Date(Date.UTC(releaseYear, 0, 1));
        const endDate = new Date(Date.UTC(releaseYear + 1, 0, 1));
        whereClause.released = {
          gte: startDate,
          lt: endDate,
        };
      } else if (releaseMonth) {
        const currentYear = new Date().getUTCFullYear();
        const startDate = new Date(Date.UTC(currentYear, releaseMonth - 1, 1));
        const endDate = new Date(Date.UTC(currentYear, releaseMonth, 1));
        whereClause.released = {
          gte: startDate,
          lt: endDate,
        };
      }
    }

    const metacriticMinimum = this.parsePositiveInteger(params.metacriticMin, null);
    if (params.metacriticOnly !== "false") {
      whereClause.metacritic = { not: null };
    }

    if (typeof metacriticMinimum === "number") {
      whereClause.metacritic = {
        ...(whereClause.metacritic as Record<string, unknown>),
        gte: metacriticMinimum,
      };
    }

    this.appendStringFilter(whereClause, "platforms", params.platforms);
    this.appendStringFilter(whereClause, "stores", params.stores);
    this.appendStringFilter(whereClause, "developers", params.developers);
    this.appendStringFilter(whereClause, "publishers", params.publishers);
    this.appendStringFilter(whereClause, "genres", params.genres);
    this.appendStringFilter(whereClause, "tags", params.tags);

    return whereClause;
  }

  private appendStringFilter(whereClause: Record<string, unknown>, fieldName: string, values?: string | null) {
    const parsedValues = this.parseCsvValues(values);

    if (!parsedValues.length) {
      return;
    }

    whereClause[fieldName] = {
      OR: parsedValues.map((value) => ({
        contains: value,
        mode: "insensitive",
      })),
    };
  }

  private buildOrderBy(sortBy?: string | null, sortOrder?: string | null) {
    const normalizedSortBy = (sortBy || "metacritic").toLowerCase();
    const normalizedSortOrder = (sortOrder || "desc").toLowerCase();
    const orderDirection = normalizedSortOrder === "asc" ? "asc" : "desc";

    switch (normalizedSortBy) {
      case "released":
        return { released: orderDirection as "asc" | "desc" };
      case "name":
        return { name: orderDirection as "asc" | "desc" };
      case "metacritic":
      default:
        return {
          metacritic: orderDirection as "asc" | "desc",
        };
    }
  }

  private parseCsvValues(values?: string | null) {
    if (!values) {
      return [];
    }

    return values
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);
  }

  private parsePositiveInteger(value: string | null | undefined, fallback: number | null) {
    if (!value) {
      return fallback;
    }

    const parsedValue = Number(value);
    if (!Number.isFinite(parsedValue)) {
      return fallback;
    }

    return parsedValue;
  }
}
