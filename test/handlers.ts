import { http, HttpResponse } from "msw";
import type { Character, PaginatedResponse, Planet } from "../src/types/types";

export const handlers = [
  // Mock SWAPI People endpoint
  http.get("https://swapi.py4e.com/api/people/", () => {
    const character: Character = {
      name: "Luke Skywalker",
      height: "172",
      mass: "77",
      hair_color: "blond",
      skin_color: "fair",
      eye_color: "blue",
      birth_year: "19BBY",
      gender: "male",
      homeworld: "https://swapi.dev/api/planets/1/",
      films: ["https://swapi.dev/api/films/1/"],
      species: [],
      vehicles: [],
      starships: [],
      created: new Date().toISOString(),
      edited: new Date().toISOString(),
      url: "https://swapi.dev/api/people/1/",
    };

    const data: PaginatedResponse<Character> = {
      count: 1,
      next: null,
      previous: null,
      results: [character],
    };

    return HttpResponse.json(data);
  }),

  // Mock Homeworld endpoint
  http.get("https://swapi.dev/api/planets/1/", () => {
    const planet: Planet = {
      name: "Tatooine",
      climate: "arid",
      terrain: "desert",
      residents: [],
      url: "https://swapi.dev/api/planets/1/",
    };

    return HttpResponse.json(planet);
  }),
];
