import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CharactersPage from "../src/pages/CharactersPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { server } from "./server";
import "@testing-library/jest-dom";

// Utility to wrap component with QueryClientProvider
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const renderWithProviders = (ui: React.ReactElement) => {
  const testQueryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={testQueryClient}>{ui}</QueryClientProvider>
  );
};

// Setup MSW before/after
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("CharactersPage", () => {
  test("renders character card from API", async () => {
    renderWithProviders(<CharactersPage />);

    // Wait for the character card to appear
    const characterCard = await screen.findByText("Luke Skywalker");
    expect(characterCard).toBeInTheDocument();
  });

  test("opens modal with correct character info when card is clicked", async () => {
    renderWithProviders(<CharactersPage />);

    const characterCard = await screen.findByText("Luke Skywalker");
    expect(characterCard).toBeInTheDocument();

    fireEvent.click(characterCard);

    // Wait for modal heading to appear
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Luke Skywalker" })
      ).toBeInTheDocument();
    });
    // Confirm character details
    expect(screen.getByText(/Height:/)).toHaveTextContent("1.72 m");
    expect(screen.getByText(/Mass:/)).toHaveTextContent("77 kg");
    expect(screen.getByText(/Birth Year:/)).toHaveTextContent("19BBY");

    // Wait for homeworld details
    await waitFor(() => {
      expect(screen.getByText(/Name: Tatooine/)).toBeInTheDocument();
    });
  });
});
