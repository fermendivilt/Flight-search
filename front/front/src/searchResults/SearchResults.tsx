import { SearchDTO } from "../dto/SearchDTO";

interface SearchResultsProps {
  search: SearchDTO;
}

export default function SearchResults({ search }: SearchResultsProps) {
  return (
    <ul>
      {Object.entries(search).map((entry, index) => (
        <li key={index}>
          {entry[0]}: {entry[1].toString()}
        </li>
      ))}
    </ul>
  );
}
