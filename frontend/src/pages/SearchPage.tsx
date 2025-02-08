/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Box, Container, Grid, Typography, Pagination, Select, MenuItem } from '@mui/material';
import axiosInstance from '../utils/AxiosInstance';
import { useLoading } from '../context/LoadingContext';
import { useLocation } from 'react-router-dom';
import MenuItemCard from '../components/molecules/MenuItemCard';

const SearchPage: React.FC = () => {
  const { setLoading } = useLoading();
  const [menuItems, setMenuItems] = useState<MenuItemTypeI[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [totalCount, setTotalCount] = useState(0);
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  useEffect(() => {
    const fetchMenuItems = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/menu-items/search?${params.toString()}&page=${page-1}&size=${limit}`);
        setMenuItems(response.data.results);
        setTotalCount(response.data.count);
      } catch (error) {
        console.error('Error fetching menu data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [params.toString(), page, limit]);

  return (
    <React.Fragment>
      <Container maxWidth="xl" disableGutters>
        <Box sx={{ flexGrow: 1, bgcolor: 'white', p: 2 }}>
          <Typography variant="h5" gutterBottom>
            Search Results
          </Typography>

          {menuItems && menuItems.length === 0 && <Typography variant="body1">No results found</Typography>}

          <Grid container spacing={2}>
            {menuItems && menuItems.map((item) => (
              <Grid item sx={{ maxWidth: '380px', flexGrow: 1, width: '320px' }} key={item.id}>
                <MenuItemCard item={item} />
              </Grid>
            ))}
          </Grid>

          <Box display="flex" justifyContent="space-between" alignItems="center" mt={3}>
            <Select value={limit} onChange={(e) => setLimit(Number(e.target.value))} size="small">
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={8}>8</MenuItem>
              <MenuItem value={20}>20</MenuItem>
            </Select>
            <Pagination
              count={Math.ceil(totalCount / limit)}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
            />
          </Box>
        </Box>
      </Container>
    </React.Fragment>
  );
};

export { SearchPage };