import React from 'react';
import PaginationMui from '@mui/material/Pagination';
import { Box } from '@mui/material';
import useTheme from '../../misc/hooks/useTheme';

const colorVariants = {
  primary: 'primary',
  secondary: 'secondary',
};

const Pagination = ({
  count,
  colorVariant = colorVariants.primary,
  page,
  onChange,
}) => {
  const { theme } = useTheme();

  return (
    <Box display="flex" justifyContent="center">
      <PaginationMui
        count={count}
        variant={colorVariant}
        page={page}
        onChange={onChange}
        sx={{
          '& .MuiPaginationItem-root': {
            color: theme.pagination.color[colorVariant].text,
            backgroundColor: theme.pagination.color[colorVariant].background,
          },
          '& .MuiPaginationItem-root:hover': {
            backgroundColor:
              theme.pagination.color[colorVariant].backgroundHovered,
          },
          '& .MuiPaginationItem-root.Mui-selected': {
            backgroundColor:
              theme.pagination.color[colorVariant].backgroundHovered,
            color: theme.pagination.color[colorVariant].text,
          },
        }}
      />
    </Box>
  );
};

export default Pagination;
