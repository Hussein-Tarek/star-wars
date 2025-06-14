import { Box, Button, Stack } from "@mui/material";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";

export const Header = () => {
  const { logout, token } = useAuth();
  if (!token) return null;
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{
        backgroundColor: "#eee",
        px: 2,
        py: 1,
        flexWrap: "wrap",
        width: "99vw",
        boxSizing: "border-box",
      }}
    >
      <Box
        component="nav"
        sx={{
          display: "flex",
          gap: 2,
        }}
      >
        <Link
          to="/characters"
          style={{
            textDecoration: "none",
            color: "blue",
            fontFamily: "Arial, sans-serif",
          }}
        >
          Characters
        </Link>
      </Box>

      <Button variant="contained" onClick={logout}>
        logout
      </Button>
    </Stack>
  );
};
