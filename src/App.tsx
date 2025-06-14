import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { Header } from "./components/Header";
import Login from "./pages/Login";
import CharactersPage from "./pages/CharactersPage";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { lightTheme } from "./theme";

const queryClient = new QueryClient();

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />

        <AuthProvider>
          <BrowserRouter>
            <Header />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/characters"
                element={
                  <PrivateRoute>
                    <CharactersPage />
                  </PrivateRoute>
                }
              />
              <Route path="/" element={<Navigate to="/characters" />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
