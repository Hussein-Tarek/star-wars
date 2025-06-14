import { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [u, setU] = useState("");
  const [p, setP] = useState("");

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        p={4}
        maxWidth={400}
        m="100px auto"
      >
        <Typography variant="h5">Login</Typography>
        <TextField
          label="Username"
          value={u}
          onChange={(e) => setU(e.target.value)}
          sx={{ mt: 2 }}
        />
        <TextField
          label="Password"
          type="password"
          value={p}
          onChange={(e) => setP(e.target.value)}
          sx={{ mt: 2 }}
        />
        <Button
          sx={{ mt: 2 }}
          variant="contained"
          onClick={() => {
            login(u, p);
            navigate("/characters");
          }}
        >
          Login
        </Button>
      </Box>
    </Box>
  );
};

export default Login;
