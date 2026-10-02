import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const TablePaginationComponent = ({ table }) => {
  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const totalRows = table.getFilteredRowModel().rows.length;
  const startRow = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
  const endRow = Math.min((pageIndex + 1) * pageSize, totalRows);
  const totalPages = Math.ceil(totalRows / pageSize) || 1;

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        px: 3,
        py: 2,
        borderTop: '1px solid rgba(47, 43, 61, 0.12)',
        gap: 2,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {`Showing ${startRow} to ${endRow} of ${totalRows} entries`}
      </Typography>
      <Pagination
        shape="rounded"
        color="primary"
        variant="tonal"
        count={totalPages}
        page={pageIndex + 1}
        onChange={(_, page) => {
          table.setPageIndex(page - 1);
        }}
        showFirstButton
        showLastButton
      />
    </Box>
  );
};

export default TablePaginationComponent;
