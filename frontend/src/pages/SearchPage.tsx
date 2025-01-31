/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';
import CanteenBanner from '../components/organisms/CanteenBanner';
import axiosInstance from '../utils/AxiosInstance';
import MenuContainer from '../components/organisms/MenuItemContainer';
import { useLoading } from '../context/LoadingContext';
import { useLocation, useParams } from 'react-router-dom';
import MenuItemCard from '../components/molecules/MenuItemCard';

export const canteenID = 3;

const SearchPage: React.FC = () => {
  const [canteen, setCanteen] = useState<any>(null);
  const [ledgerData, setLedgerData] = useState<any>(null); // Changed menuData to ledgerData
  const { setLoading } = useLoading();
  const [menuItems, setMenuItems] = useState<MenuItemTypeI[]>([]);
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  console.log('params', params);
  console.log('location', location);
  console.log(params.get('name'));
  console.log(params.toString());

  useEffect(() => {
    const fetchMenuItems = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/menu-items?${params.toString()}`);
        setMenuItems(response.data);
      } catch (error) {
        console.error('Error fetching ledger data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [params.toString()]);

  return (
    <React.Fragment>
      <Container maxWidth="xl" disableGutters>
        <Box sx={{ flexGrow: 1, bgcolor: 'white', p: 1 }}>{canteen && <CanteenBanner canteen={canteen} />}</Box>

        <Box sx={{ flexGrow: 1, bgcolor: 'white', p: 2 }}>
          <Typography variant="h4" gutterBottom>
            Search Results
          </Typography>

          {menuItems.length === 0 && <Typography variant="body1">No results found</Typography>}

          <Grid container spacing={2}>
            {menuItems.map((item) => (
              <Grid item sx={{ maxWidth: '380px', flexGrow: 1, width: '320px' }} key={item.id}>
                <MenuItemCard item={item} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </React.Fragment>
  );
};

export { SearchPage };
