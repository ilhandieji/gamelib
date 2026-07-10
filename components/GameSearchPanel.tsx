"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type GameRecord = {
  slug: string;
  name: string | null;
  name_original: string | null;
  alternative_names: string | null;
  released: string | null;
  metacritic: number | null;
  background_image: string | null;
  platforms: string | null;
  genres: string | null;
  developers: string | null;
  publishers: string | null;
  tags: string | null;
  stores: string | null;
  rawg_id: number | null;
};

type SearchResponse = {
  games: GameRecord[];
  pagination: {
    page: number;
    limit: number;
    totalGames: number;
    totalPages: number;
  };
};

export function GameSearchPanel() {
  const [query, setQuery] = useState("");
  const [releaseYear, setReleaseYear] = useState("");
  const [releaseMonth, setReleaseMonth] = useState("");
  const [metacriticMin, setMetacriticMin] = useState("");
  const [platforms, setPlatforms] = useState("");
  const [genres, setGenres] = useState("");
  const [developers, setDevelopers] = useState("");
  const [publishers, setPublishers] = useState("");
  const [stores, setStores] = useState("");
  const [tags, setTags] = useState("");
  const [sortBy, setSortBy] = useState("metacritic");
  const [sortOrder, setSortOrder] = useState("desc");
  const [games, setGames] = useState<GameRecord[]>([]);
  const [pagination, setPagination] = useState<SearchResponse["pagination"] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadGames = async () => {
    setIsLoading(true);
    const params = new URLSearchParams();

    if (query) params.set("query", query);
    if (releaseYear) params.set("releaseYear", releaseYear);
    if (releaseMonth) params.set("releaseMonth", releaseMonth);
    if (metacriticMin) params.set("metacriticMin", metacriticMin);
    if (platforms) params.set("platforms", platforms);
    if (genres) params.set("genres", genres);
    if (developers) params.set("developers", developers);
    if (publishers) params.set("publishers", publishers);
    if (stores) params.set("stores", stores);
    if (tags) params.set("tags", tags);
    if (sortBy) params.set("sortBy", sortBy);
    if (sortOrder) params.set("sortOrder", sortOrder);
    params.set("limit", "20");
    params.set("page", "1");

    try {
      const response = await fetch(`/api/games?${params.toString()}`);
      const result: SearchResponse = await response.json();
      setGames(result.games);
      setPagination(result.pagination);
    } catch (error) {
      console.error("Failed to load games", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filters = useMemo(
    () => ({
      query,
      releaseYear,
      releaseMonth,
      metacriticMin,
      platforms,
      genres,
      developers,
      publishers,
      stores,
      tags,
      sortBy,
      sortOrder,
    }),
    [query, releaseYear, releaseMonth, metacriticMin, platforms, genres, developers, publishers, stores, tags, sortBy, sortOrder],
  );

  useEffect(() => {
    void loadGames();
  }, [filters, loadGames]);
    setIsLoading(true);
    const params = new URLSearchParams();

    if (query) params.set("query", query);
    if (releaseYear) params.set("releaseYear", releaseYear);
    if (releaseMonth) params.set("releaseMonth", releaseMonth);
    if (metacriticMin) params.set("metacriticMin", metacriticMin);
    if (platforms) params.set("platforms", platforms);
    if (genres) params.set("genres", genres);
    if (developers) params.set("developers", developers);
    if (publishers) params.set("publishers", publishers);
    if (stores) params.set("stores", stores);
    if (tags) params.set("tags", tags);
    if (sortBy) params.set("sortBy", sortBy);
    if (sortOrder) params.set("sortOrder", sortOrder);
    params.set("limit", "20");
    params.set("page", "1");

    try {
      const response = await fetch(`/api/games?${params.toString()}`);
      const result: SearchResponse = await response.json();
      setGames(result.games);
      setPagination(result.pagination);
    } catch (error) {
      console.error("Failed to load games", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Advanced game search</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <Input placeholder="Search by title, slug, or alias" value={query} onChange={(event) => setQuery(event.target.value)} />
          <Input placeholder="Release year" value={releaseYear} onChange={(event) => setReleaseYear(event.target.value)} />
          <Input placeholder="Release month" value={releaseMonth} onChange={(event) => setReleaseMonth(event.target.value)} />
          <Input placeholder="Min metacritic" value={metacriticMin} onChange={(event) => setMetacriticMin(event.target.value)} />
          <Input placeholder="Platforms (comma separated)" value={platforms} onChange={(event) => setPlatforms(event.target.value)} />
          <Input placeholder="Genres (comma separated)" value={genres} onChange={(event) => setGenres(event.target.value)} />
          <Input placeholder="Developers (comma separated)" value={developers} onChange={(event) => setDevelopers(event.target.value)} />
          <Input placeholder="Publishers (comma separated)" value={publishers} onChange={(event) => setPublishers(event.target.value)} />
          <Input placeholder="Stores (comma separated)" value={stores} onChange={(event) => setStores(event.target.value)} />
          <Input placeholder="Tags (comma separated)" value={tags} onChange={(event) => setTags(event.target.value)} />
          <select className="rounded-lg border border-input bg-background px-3 py-2 text-sm" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="metacritic">Metacritic</option>
            <option value="released">Release date</option>
            <option value="name">Name</option>
          </select>
          <select className="rounded-lg border border-input bg-background px-3 py-2 text-sm" value={sortOrder} onChange={(event) => setSortOrder(event.target.value)}>
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
          <Button type="button" onClick={() => void loadGames()} className="md:col-span-2 xl:col-span-1">Apply filters</Button>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{isLoading ? "Loading..." : `${games.length} games found`}</span>
        {pagination ? <span>Page {pagination.page} of {pagination.totalPages}</span> : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {games.map((game) => (
          <Card key={game.slug}>
            <CardContent className="space-y-2">
              <div className="text-sm font-semibold">{game.name || game.slug}</div>
              <div className="text-xs text-muted-foreground">{game.name_original || "No original name"}</div>
              <div className="text-xs">Released: {game.released ? new Date(game.released).toLocaleDateString() : "Unknown"}</div>
              <div className="text-xs">Metacritic: {game.metacritic ?? "N/A"}</div>
              <div className="text-xs">Platforms: {game.platforms || "Unknown"}</div>
              <div className="text-xs">Genres: {game.genres || "Unknown"}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
