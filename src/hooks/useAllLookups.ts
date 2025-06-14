import { useQuery } from "@tanstack/react-query";
import type { Film, Planet, Species } from "../types/types";

type LookupMap<T> = Record<string, T>;

interface UseAllLookupsReturn {
  allHomeWorlds: LookupMap<Planet>;
  allSpecies: LookupMap<Species>;
  allFilms: LookupMap<Film>;
  isLoadingLookups: boolean;
}

export const useAllLookups = (): UseAllLookupsReturn => {
  const homeWorldsQuery = useQuery<LookupMap<Planet>>({
    queryKey: ["homeWorlds"],
    queryFn: async () => {
      const res = await fetchAllPages<Planet>(
        "https://swapi.py4e.com/api/planets/"
      );
      return Object.fromEntries(res.map((p) => [p.url, p]));
    },
  });

  const speciesQuery = useQuery<LookupMap<Species>>({
    queryKey: ["species"],
    queryFn: async () => {
      const res = await fetchAllPages<Species>(
        "https://swapi.py4e.com/api/species/"
      );
      return Object.fromEntries(res.map((s) => [s.url, s]));
    },
  });

  const filmsQuery = useQuery<LookupMap<Film>>({
    queryKey: ["films"],
    queryFn: async () => {
      const res = await fetchAllPages<Film>(
        "https://swapi.py4e.com/api/films/"
      );
      return Object.fromEntries(res.map((f) => [f.url, f]));
    },
  });

  return {
    allHomeWorlds: homeWorldsQuery.data ?? {},
    allSpecies: speciesQuery.data ?? {},
    allFilms: filmsQuery.data ?? {},
    isLoadingLookups:
      homeWorldsQuery.isLoading ||
      speciesQuery.isLoading ||
      filmsQuery.isLoading,
  };
};

const fetchAllPages = async <T>(baseUrl: string): Promise<T[]> => {
  let results: T[] = [];
  let nextUrl: string | null = baseUrl;

  while (nextUrl) {
    const res: Response = await fetch(nextUrl);
    const json: { results: T[]; next: string | null } = await res.json();
    results = results.concat(json.results as T[]);
    nextUrl = json.next;
  }

  return results;
};
