import { useState } from "react";
import "./App.css";
import {
  Container,
  Paper,
  Typography,
} from "@mui/material";
import Search from "./search/Search";
import SearchResults from "./searchResults/SearchResults";

type Page = "search" | "results" | "details";

function App() {

  const [page, setPage] = useState<Page>("search")

  return (
    <Container fixed sx={{ paddingY: 16 }}>
      {page === "search" && 
        <Typography variant="h3" gutterBottom align="center">
          Flight Search
        </Typography>
      }

      <Paper elevation={24} sx={{ padding: 16 }}>
      {page === "search" && <Search moveToResults={() => setPage("results")}/>}
      {page === "results" && <SearchResults />}
      {page === "details" && <p>Details</p>}
      </Paper>
    </Container>
  );
}

export default App;
