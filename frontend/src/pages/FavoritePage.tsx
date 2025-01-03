/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import axiosInstance from '../utils/AxiosInstance';
import { toast } from 'react-toastify';
import MenuItemCard from '../components/molecules/MenuItemCard';
import { useLoading } from '../context/LoadingContext';

const FavoritesPage: React.FC = () => {
  const [favorites, setFavorites] = useState<any[]>([]);
  const { loading, setLoading } = useLoading();

  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/profile/favorites'); // Fetch favorites from API
        setFavorites(response.data);
      } catch (error) {
        console.error('Error fetching favorite items:', error);
        toast.error('Failed to fetch favorite items.'); // Notify user of the error
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchFavorites();
  }, []);

  return (
    <React.Fragment>
      <Box sx={{ flexGrow: 1, p: 2, bgcolor: 'white' }}>
        <Typography variant="h4" gutterBottom>
          My Favorites
        </Typography>

        {loading ? (
          <Typography variant="body1"></Typography>
        ) : favorites.length === 0 ? (
          <Typography variant="body1">You have no favorite items.</Typography>
        ) : (
          <Box
            sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' } }}
          >
            {favorites.map((item) => (
              <MenuItemCard key={item.id} item={item.menuItem} /> // Use the reusable component for each favorite
            ))}
          </Box>
        )}
      </Box>
    </React.Fragment>
  );
};

export { FavoritesPage };
