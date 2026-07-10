import type { Prisma } from "@/app/generated/prisma/client";

export type GameSearchCriteria = {
  query?: string;
  slug?: string;
  releaseMonth?: string;
  releaseYear?: string;
  metacriticMin?: string;
  metacriticOnly?: string;
  platforms?: string[];
  stores?: string[];
  developers?: string[];
  publishers?: string[];
  genres?: string[];
  tags?: string[];
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit?: number | "all";
};

export class GameSearchQuery {
  constructor(private readonly searchParams: URLSearchParams) {}

  parse(): GameSearchCriteria {
    const advancedFilters = this.parseAdvancedFilters();

    return {
      query: this.readTextValue("query", advancedFilters.query),
      slug: this.readTextValue("slug", advancedFilters.slug),
      releaseMonth: this.readTextValue("releaseMonth", advancedFilters.releaseMonth),
      releaseYear: this.readTextValue("releaseYear", advancedFilters.releaseYear),
      metacriticMin: this.readTextValue("metacriticMin", advancedFilters.metacriticMin),
      metacriticOnly: this.readTextValue("metacriticOnly", advancedFilters.metacriticOnly),
      platforms: this.readStringArrayValue("platforms", advancedFilters.platforms),
      stores: this.readStringArrayValue("stores", advancedFilters.stores),
      developers: this.readStringArrayValue("developers", advancedFilters.developers),
      publishers: this.readStringArrayValue("publishers", advancedFilters.publishers),
      genres: this.readStringArrayValue("genres", advancedFilters.genres),
      tags: this.readStringArrayValue("tags", advancedFilters.tags),
      sortBy: this.readTextValue("sortBy", advancedFilters.sortBy),
      sortOrder: this.readTextValue("sortOrder", advancedFilters.sortOrder),
      page: this.parsePositiveInteger(this.readTextValue("page")),
      limit: this.parseLimitValue(this.readTextValue("limit")),
    };
  }

  private parseAdvancedFilters(): Record<string, string | string[] | undefined> {
    const encodedFilters = this.searchParams.get("filters") || this.searchParams.get("advancedFilters");
    if (!encodedFilters) {
      return {};
    }

    try {
      const parsedFilters = JSON.parse(encodedFilters) as Record<string, unknown>;
      return Object.entries(parsedFilters).reduce<Record<string, string | string[] | undefined>>(
        (accumulator, [key, value]) => {
          if (typeof value === "string") {
            accumulator[key] = value;
          } else if (Array.isArray(value)) {
            accumulator[key] = value.filter((entry): entry is string => typeof entry === "string");
          }
          return accumulator;
        },
        {}
      );
    } catch {
      return {};
    }
  }

  private readTextValue(primaryKey: string, fallback?: string | string[] | undefined) {
    const directValue = this.searchParams.get(primaryKey);
    if (directValue) {
      return directValue;
    }

    if (Array.isArray(fallback)) {
      return fallback[0];
    }

    return fallback;
  }

  private readStringArrayValue(primaryKey: string, fallback?: string | string[] | undefined) {
    const repeatedValues = this.searchParams.getAll(primaryKey);
    const parsedValues = repeatedValues.flatMap((value) => value.split(",")).map((value) => value.trim()).filter(Boolean);

    if (parsedValues.length) {
      return parsedValues;
    }

    if (Array.isArray(fallback)) {
      return fallback;
    }

    if (typeof fallback === "string") {
      return fallback.split(",").map((value) => value.trim()).filter(Boolean);
    }

    return [];
  }

  private parsePositiveInteger(value?: string | null) {
    if (!value) {
      return 1;
    }

    const parsedValue = Number(value);
    return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : 1;
  }

  private parseLimitValue(value?: string | null) {
    if (!value) {
      return 20;
    }

    if (value.toLowerCase() === "all") {
      return "all";
    }

    const parsedValue = Number(value);
    return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : 20;
  }
}

export class GameSearchService {
  constructor(private readonly prismaClient = prisma) {}

  async searchGames(criteria: GameSearchCriteria) {
    const page = criteria.page ?? 1;
    const limit = criteria.limit ?? 20;
    const shouldReturnAllResults = limit === "all";
    const effectiveLimit = shouldReturnAllResults ? undefined : limit;
    const offset = effectiveLimit ? (page - 1) * effectiveLimit : 0;

    const whereClause = this.buildWhereClause(criteria);
    const orderBy = this.buildOrderBy(criteria.sortBy, criteria.sortOrder);

    const [games, totalGames] = await Promise.all([
      this.prismaClient.games.findMany({
        where: whereClause,
        orderBy,
        skip: effectiveLimit ? offset : undefined,
        take: effectiveLimit,
      }),
      this.prismaClient.games.count({ where: whereClause }),
    ]);

    const effectivePageLimit = effectiveLimit ?? totalGames;

    return {
      games,
      pagination: {
        page,
        limit: effectivePageLimit,
        totalGames,
        totalPages: effectiveLimit ? Math.ceil(totalGames / effectiveLimit) : 1,
      },
    };
  }

  private buildWhereClause(criteria: GameSearchCriteria): Prisma.GamesWhereInput {
    const conditions: Prisma.GamesWhereInput[] = [];

    const searchText = criteria.query?.trim() || criteria.slug?.trim();
    if (searchText) {
      conditions.push({
        OR: [
          { slug: { contains: searchText, mode: "insensitive" } },
          { name: { contains: searchText, mode: "insensitive" } },
          { name_original: { contains: searchText, mode: "insensitive" } },
          { alternative_names: { contains: searchText, mode: "insensitive" } },
        ],
      });
    }

    if (criteria.releaseMonth || criteria.releaseYear) {
      const releaseMonth = this.parsePositiveInteger(criteria.releaseMonth);
      const releaseYear = this.parsePositiveInteger(criteria.releaseYear);

      if (releaseMonth && releaseYear) {
        const startDate = new Date(Date.UTC(releaseYear, releaseMonth - 1, 1));
        const endDate = new Date(Date.UTC(releaseYear, releaseMonth, 1));
        conditions.push({ released: { gte: startDate, lt: endDate } });
      } else if (releaseYear) {
        const startDate = new Date(Date.UTC(releaseYear, 0, 1));
        const endDate = new Date(Date.UTC(releaseYear + 1, 0, 1));
        conditions.push({ released: { gte: startDate, lt: endDate } });
      } else if (releaseMonth) {
        const currentYear = new Date().getUTCFullYear();
        const startDate = new Date(Date.UTC(currentYear, releaseMonth - 1, 1));
        const endDate = new Date(Date.UTC(currentYear, releaseMonth, 1));
        conditions.push({ released: { gte: startDate, lt: endDate } });
      }
    }

    if (criteria.metacriticOnly !== "false") {
      conditions.push({ metacritic: { not: null } });
    }

    const metacriticMinimum = this.parsePositiveInteger(criteria.metacriticMin);
    if (metacriticMinimum) {
      conditions.push({ metacritic: { gte: metacriticMinimum } });
    }

    this.addStringFilterConditions(conditions, "platforms", criteria.platforms);
    this.addStringFilterConditions(conditions, "stores", criteria.stores);
    this.addStringFilterConditions(conditions, "developers", criteria.developers);
    this.addStringFilterConditions(conditions, "publishers", criteria.publishers);
    this.addStringFilterConditions(conditions, "genres", criteria.genres);
    this.addStringFilterConditions(conditions, "tags", criteria.tags);

    return conditions.length ? { AND: conditions } : {};
  }

  private addStringFilterConditions(
    conditions: Prisma.GamesWhereInput[],
    fieldName: keyof Prisma.GamesWhereInput,
    values?: string[]
  ) {
    if (!values?.length) {
      return;
    }

    conditions.push({
      [fieldName]: {
        OR: values.map((value) => ({
          contains: value,
          mode: "insensitive",
        })),
      },
    } as Prisma.GamesWhereInput);
  }

  private buildOrderBy(sortBy?: string | null, sortOrder?: string | null) {
    const normalizedSortBy = (sortBy || "metacritic").toLowerCase();
    const normalizedSortOrder = (sortOrder || "desc").toLowerCase();
    const orderDirection: Prisma.SortOrder = normalizedSortOrder === "asc" ? "asc" : "desc";

    switch (normalizedSortBy) {
      case "released":
        return [{ released: orderDirection }, { rawg_id: "asc" }] satisfies Prisma.GamesOrderByWithRelationInput[];
      case "name":
        return [{ name: orderDirection }, { rawg_id: "asc" }] satisfies Prisma.GamesOrderByWithRelationInput[];
      case "metacritic":
      default:
        return [{ metacritic: orderDirection }, { rawg_id: "asc" }] satisfies Prisma.GamesOrderByWithRelationInput[];
    }
  }

  private parsePositiveInteger(value?: string | null) {
    if (!value) {
      return undefined;
    }

    const parsedValue = Number(value);
    return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : undefined;
  }
}

import { prisma } from "@/lib/prisma";
