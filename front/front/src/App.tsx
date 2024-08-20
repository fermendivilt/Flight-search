import React from "react";
import logo from "./logo.svg";
import "./App.css";
import {
  Container,
  Paper,
  Typography,
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import Search from "./search/Search";


function App() {

  return (
    <Container fixed sx={{ paddingY: 16 }}>
      <Typography variant="h3" gutterBottom align="center">
        Flight Search
      </Typography>

      <Paper elevation={24} sx={{ padding: 16 }}>
        <Search />
      </Paper>
    </Container>
  );
}

export default App;
