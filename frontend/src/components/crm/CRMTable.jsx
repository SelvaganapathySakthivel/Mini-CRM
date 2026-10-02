import { useEffect, useMemo, useState } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import TablePagination from '@mui/material/TablePagination';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';
import classnames from 'classnames';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
import { rankItem } from '@tanstack/match-sorter-utils';

import TablePaginationComponent from '@components/TablePaginationComponent';
import CustomTextField from '@core/components/mui/TextField';
import ChevronRight from '@menu/svg/ChevronRight';
import styles from '@core/styles/table.module.css';

const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({ itemRank });
  return itemRank.passed;
};

// Debounced input component
const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value, debounce, onChange]);

  return <CustomTextField {...props} value={value} onChange={(e) => setValue(e.target.value)} />;
};

// Column filter component (number range or text search)
const Filter = ({ column, table }) => {
  const firstValue = table.getPreFilteredRowModel().flatRows[0]?.getValue(column.id);
  const columnFilterValue = column.getFilterValue();

  return typeof firstValue === 'number' ? (
    <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
      <CustomTextField
        fullWidth
        type="number"
        sx={{ minWidth: 80, maxWidth: 110 }}
        value={columnFilterValue?.[0] ?? ''}
        onChange={(e) => column.setFilterValue((old) => [e.target.value, old?.[1]])}
        placeholder={`Min ${column.getFacetedMinMaxValues()?.[0] ? `(${column.getFacetedMinMaxValues()?.[0]})` : ''}`}
      />
      <CustomTextField
        fullWidth
        type="number"
        sx={{ minWidth: 80, maxWidth: 110 }}
        value={columnFilterValue?.[1] ?? ''}
        onChange={(e) => column.setFilterValue((old) => [old?.[0], e.target.value])}
        placeholder={`Max ${column.getFacetedMinMaxValues()?.[1] ? `(${column.getFacetedMinMaxValues()?.[1]})` : ''}`}
      />
    </div>
  ) : (
    <CustomTextField
      fullWidth
      sx={{ minWidth: 100, marginTop: '6px' }}
      value={columnFilterValue ?? ''}
      onChange={(e) => column.setFilterValue(e.target.value)}
      placeholder="Search..."
    />
  );
};

/**
 * Reusable exact Vuexy React Table (TanStack Table) Component
 */
export const CRMTable = ({
  title,
  columns = [],
  data = [],
  actions,
  filters,
  extraFilters,
  search,
  onSearchChange,
  searchPlaceholder = 'Search all columns...',
  emptyMessage = 'No data available',
  loadingMessage = 'Loading data...',
  loading = false,
  enableColumnFilters = false,
  initialPageSize = 10,
}) => {
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const activeSearch = search !== undefined ? search : globalFilter;
  const handleSearchChange = (val) => {
    if (onSearchChange) {
      onSearchChange(val);
    } else {
      setGlobalFilter(String(val));
    }
  };

  const renderFilters = extraFilters || filters;
  const memoizedData = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  // Universal Column Adapter: supports both TanStack definitions and custom { id, label, render } objects
  const memoizedColumns = useMemo(() => {
    if (!Array.isArray(columns)) return [];
    return columns.map((col) => {
      if (col.accessorKey || (col.header && col.cell)) {
        return col;
      }
      return {
        id: col.id || col.accessorKey,
        accessorKey: col.id || col.accessorKey,
        header: col.header || col.label || col.id || '',
        cell: (info) => {
          if (col.cell) {
            return typeof col.cell === 'function' ? col.cell(info) : col.cell;
          }
          if (col.render) {
            return col.render(info.row.original, info.row.index);
          }
          return info.getValue() ?? '—';
        },
      };
    });
  }, [columns]);

  const table = useReactTable({
    data: memoizedData,
    columns: memoizedColumns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      columnFilters,
      globalFilter: activeSearch,
    },
    initialState: {
      pagination: {
        pageSize: initialPageSize,
      },
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
  });

  return (
    <Card
      sx={{
        borderRadius: 2.5,
        border: '1px solid rgba(47, 43, 61, 0.12)',
        boxShadow: '0 2px 10px 0 rgba(47, 43, 61, 0.08)',
        bgcolor: 'background.paper',
        overflow: 'hidden',
      }}
    >
      {/* Unified Toolbar: Filters & Title on Left, Search & Actions on Right (Same straight alignment) */}
      {(title || actions || searchPlaceholder || renderFilters) && (
        <Box
          sx={{
            p: 2.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          {/* Left side: Title and/or Filters */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', flex: 1, minWidth: { xs: '100%', md: 'auto' } }}>
            {title && (
              <Box sx={{ fontSize: '1.125rem', fontWeight: 600, color: 'text.primary', mr: 1 }}>
                {title}
              </Box>
            )}
            {renderFilters}
          </Box>

          {/* Right side: Search and Actions */}
          {(searchPlaceholder || actions) && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                flexWrap: 'wrap',
                justifyContent: 'flex-end',
                ml: { xs: 0, md: 'auto' },
                width: { xs: '100%', md: 'auto' },
              }}
            >
              {searchPlaceholder && (
                <DebouncedInput
                  size="small"
                  value={activeSearch ?? ''}
                  onChange={handleSearchChange}
                  placeholder={searchPlaceholder}
                  sx={{ minWidth: { xs: '100%', sm: 240 } }}
                />
              )}
              {actions}
            </Box>
          )}
        </Box>
      )}

      {/* TanStack Table with table.module.css */}
      <div style={{ overflowX: 'auto', width: '100%', position: 'relative' }}>
        {/* Subtle MUI LinearProgress at the top of the table */}
        <Box sx={{ width: '100%', height: 3, overflow: 'hidden' }}>
          {loading && (
            <LinearProgress
              sx={{
                height: 3,
                bgcolor: 'rgba(115, 103, 240, 0.12)',
                '& .MuiLinearProgress-bar': {
                  bgcolor: 'primary.main',
                },
              }}
            />
          )}
        </Box>

        <table className={styles.table}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th key={header.id} style={{ userSelect: 'none' }}>
                      {header.isPlaceholder ? null : (
                        <>
                          <div
                            className={classnames({
                              'flex items-center': header.column.getIsSorted(),
                              'cursor-pointer select-none': header.column.getCanSort(),
                            })}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              cursor: header.column.getCanSort() ? 'pointer' : 'default',
                              gap: '4px',
                            }}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {{
                              asc: (
                                <ChevronRight
                                  style={{
                                    transform: 'rotate(-90deg)',
                                    fontSize: '1.25rem',
                                    color: '#7367F0',
                                  }}
                                />
                              ),
                              desc: (
                                <ChevronRight
                                  style={{
                                    transform: 'rotate(90deg)',
                                    fontSize: '1.25rem',
                                    color: '#7367F0',
                                  }}
                                />
                              ),
                            }[header.column.getIsSorted()] ?? null}
                          </div>
                          {enableColumnFilters && header.column.getCanFilter() && (
                            <Filter column={header.column} table={table} />
                          )}
                        </>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          {loading ? (
            <tbody>
              <tr>
                <td
                  colSpan={Math.max(table.getVisibleFlatColumns().length || memoizedColumns.length || 1, 1)}
                  style={{ textAlign: 'center', padding: '56px 16px', color: '#6D6777' }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1.5,
                      py: 2,
                    }}
                  >
                    <CircularProgress
                      size={32}
                      thickness={3.5}
                      sx={{ color: 'primary.main' }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ color: 'text.secondary', fontWeight: 500 }}
                    >
                      {loadingMessage}
                    </Typography>
                  </Box>
                </td>
              </tr>
            </tbody>
          ) : table.getFilteredRowModel().rows.length === 0 ? (
            <tbody>
              <tr>
                <td
                  colSpan={Math.max(table.getVisibleFlatColumns().length || memoizedColumns.length || 1, 1)}
                  style={{ textAlign: 'center', padding: '40px 16px', color: '#6D6777' }}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.95rem' }}>
                      {emptyMessage}
                    </Box>
                    <Box sx={{ fontSize: '0.8125rem' }}>
                      Try adjusting your search query or filter options
                    </Box>
                  </Box>
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {table.getRowModel().rows.map((row) => {
                return (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <td key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          )}
        </table>
      </div>

      {/* Vuexy TanStack Table Pagination */}
      <TablePagination
        component={() => <TablePaginationComponent table={table} />}
        count={table.getFilteredRowModel().rows.length}
        rowsPerPage={table.getState().pagination.pageSize}
        page={table.getState().pagination.pageIndex}
        onPageChange={(_, page) => {
          table.setPageIndex(page);
        }}
      />
    </Card>
  );
};

export default CRMTable;
