import { Button, Divider, Stack } from "@mui/material";
import { SearchDTO } from "../dto/SearchDTO";
import { useSearchFlights } from "../requester/Requester";
import { useEffect, useState } from "react";
import TablePaginationInput from "../components/TablePaginationInput";
import { ArrowBackIosNew } from "@mui/icons-material";
import OneWayFlight from "../components/OneWayFlight";
import TwoWayFlight from "../components/TwoWayFlight";

interface SearchResultsProps {
  search: SearchDTO;
  backToSearch: () => void;
}

const allnums = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24,
];

export default function SearchResults({
  search,
  backToSearch,
}: SearchResultsProps) {
  const fetchFlights = useSearchFlights(search);
  const [nums, setNums] = useState<Array<number>>([]);

  const changeNums = (page: number, pageSize: number) => {
    setNums([]);

    const result: typeof nums = [];
    const pageIndex = page * pageSize;

    for (
      let index = pageIndex;
      index < pageIndex + pageSize && index < allnums.length;
      index++
    ) {
      result.push(allnums[index]);
    }

    setNums(result);
  };

  useEffect(() => {
    changeNums(0, 10);
  }, []);

  return (
    <Stack divider={<Divider flexItem />} spacing={2}>
      <Stack direction={"row"}>
        <Button variant="outlined">
          <ArrowBackIosNew /> Return to search
        </Button>
      </Stack>
      
      <OneWayFlight />

      <TwoWayFlight />
      
      <p>{nums.map((x) => x + " ")}</p>
      <TablePaginationInput count={allnums.length} setElements={changeNums} />
    </Stack>
  );
}
