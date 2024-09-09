import { useState } from 'react';
import TablePagination from '@mui/material/TablePagination';

interface Props {
    count: number;
    setElements: (page: number, pageSize: number) => void;
}

export default function TablePaginationInput({ count, setElements }: Props) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (
    newPage: number,
  ) => {
    setPage(newPage);
    setElements(newPage, rowsPerPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TablePagination
      component="div"
      count={count}
      page={page}
      onPageChange={(_e, value) => handleChangePage(value)}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
  );
}
