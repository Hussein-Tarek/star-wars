import { useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Grid,
  Typography,
  CircularProgress,
  TextField,
  MenuItem,
  Button,
  Modal,
} from "@mui/material";
import { useAllLookups } from "../hooks/useAllLookups";
import type { Character, PaginatedResponse, Planet } from "../types/types";
import { CharacterCard } from "../components/CharacterCard";

const fetchPage = async (
  page: number
): Promise<PaginatedResponse<Character>> => {
  const res = await axios.get(
    `https://swapi.py4e.com/api/people/?page=${page}`
  );
  return res.data;
};

const fetchUrl = async (url: string) => axios.get(url).then((r) => r.data);

export const speciesColors: Record<string, string> = {
  Human: "#f5f5dc",
  Droid: "#c0c0c0",
  Wookiee: "#8b4513",
  Rodian: "#006400",
  Hutt: "#556b2f",
  "Yoda's species": "#98fb98",
  Trandoshan: "#cd853f",
  "Mon Calamari": "#4682b4",
  Ewok: "#deb887",
  Sullustan: "#b0e0e6",
  Neimodian: "#9acd32",
  default: "#e0e0e0",
};

export default function CharactersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [fHome, setFHome] = useState("");
  const [fFilm, setFilm] = useState("");
  const [fSpec, setSpec] = useState("");
  const [selected, setSelected] = useState<Character | null>(null);

  const { allHomeWorlds, allFilms, allSpecies, isLoadingLookups } =
    useAllLookups();
  const { data, isLoading, isError } = useQuery<PaginatedResponse<Character>>({
    queryKey: ["people", page],
    queryFn: () => fetchPage(page),
  });

  if (isLoading || isLoadingLookups)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mt: 4,
          height: "95vh",
          width: "99vw",
          boxSizing: "border-box",
        }}
      >
        <CircularProgress />
      </Box>
    );
  if (isError)
    return <Typography color="error">Error loading data.</Typography>;

  const chars = data?.results ?? [];
  const homeworlds = Array.from(new Set(chars.map((c) => c.homeworld)));
  const films = Array.from(new Set(chars.flatMap((c) => c.films)));
  const specs = Array.from(new Set(chars.flatMap((c) => c.species)));

  const filtered = chars.filter((c: Character) => {
    const mName =
      !search || c.name.toLowerCase().includes(search.toLowerCase());
    const mHome = !fHome || c.homeworld === fHome;
    const mFilm = !fFilm || c.films.includes(fFilm);
    const mSpec = !fSpec || c.species.includes(fSpec);
    return mName && mHome && mFilm && mSpec;
  });

  return (
    <Box p={4} width="95vw" height={"95vh"}>
      <Typography variant="h4">Star Wars Characters</Typography>

      <Grid container spacing={2} mt={2} alignItems="center">
        {[
          { label: "Search", prop: search, set: setSearch },
          {
            label: "Home World",
            prop: fHome,
            set: setFHome,
            opts: homeworlds,
            key: allHomeWorlds,
          },
          {
            label: "Film",
            prop: fFilm,
            set: setFilm,
            opts: films,
            key: allFilms,
          },
          {
            label: "Species",
            prop: fSpec,
            set: setSpec,
            opts: specs,
            key: allSpecies,
          },
        ].map(({ label, prop, set, opts, key }, i) => (
          <Grid size={{ xs: 12, sm: opts ? 3 : 12 }} key={i}>
            {opts ? (
              <TextField
                select
                fullWidth
                label={label}
                value={prop}
                onChange={(e) => set(e.target.value)}
                sx={{ minWidth: 200 }}
              >
                <MenuItem value="">All</MenuItem>
                {opts.map((v) => (
                  <MenuItem key={v} value={v}>
                    {key[v]
                      ? "name" in key[v]
                        ? key[v].name
                        : "title" in key[v]
                        ? key[v].title
                        : v
                      : v}
                  </MenuItem>
                ))}
              </TextField>
            ) : (
              <TextField
                fullWidth
                label="Search name"
                value={prop}
                onChange={(e) => set(e.target.value)}
              />
            )}
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2} mt={2} justifyContent={"center"}>
        {filtered.map((c: Character) => {
          const speciesName =
            c.species.length && allSpecies[c.species[0]]
              ? allSpecies[c.species[0]].name
              : "default";

          const speciesColor =
            speciesColors[speciesName] || speciesColors["default"];
          return (
            <Grid size={{ xs: 8, sm: 4, md: 3, lg: 2 }} key={c.url}>
              <CharacterCard
                character={c}
                onClick={(character: Character) => setSelected(character)}
                speciesColor={speciesColor}
              />
            </Grid>
          );
        })}
      </Grid>
      {filtered.length < 1 && (
        <Typography mt={2} textAlign="center">
          No Result Found
        </Typography>
      )}

      <Box mt={3} display="flex" justifyContent="center" alignItems="center">
        <Button
          disabled={!data?.previous}
          onClick={() => setPage((p) => p - 1)}
        >
          Prev
        </Button>
        <Box sx={{ px: 1, mx: 2 }}> {page}</Box>
        <Button
          disabled={!data?.next || filtered.length < 10}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </Box>

      {!!selected && (
        <Modal open onClose={() => setSelected(null)}>
          <Box
            p={4}
            bgcolor="background.paper"
            mx="auto"
            mt={10}
            maxWidth={600}
            borderRadius={2}
          >
            <Typography variant="h5" gutterBottom color="primary">
              {selected.name}
            </Typography>
            <Typography>
              Height: {(Number(selected.height) / 100).toFixed(2)} m
            </Typography>
            <Typography>Mass: {selected.mass} kg</Typography>
            <Typography>
              Added: {dayjs(selected.created).format("DD-MM-YYYY")}
            </Typography>
            <Typography>Films: {selected.films?.length}</Typography>
            <Typography>Birth Year: {selected.birth_year}</Typography>
            <Typography mt={2} variant="subtitle1">
              Home World
            </Typography>
            <HomeWorldInfo url={selected.homeworld} />
          </Box>
        </Modal>
      )}
    </Box>
  );
}

function HomeWorldInfo({ url }: { url: string }) {
  const { data, isLoading, isError } = useQuery<Planet>({
    queryKey: ["planet", url],
    queryFn: () => fetchUrl(url),
    enabled: !!url,
  });

  if (isLoading) return <CircularProgress size={20} />;
  if (isError)
    return <Typography color="error">Error fetching data</Typography>;
  return (
    <>
      <Typography>Name: {data?.name}</Typography>
      <Typography>Terrain: {data?.terrain}</Typography>
      <Typography>Climate: {data?.climate}</Typography>
      <Typography>Residents: {data?.residents?.length ?? "-"}</Typography>
    </>
  );
}
