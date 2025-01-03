import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import MenuItemCard from '../molecules/MenuItemCard';

interface MenuContainerProps {
  menu: {
    id: number;
    name: string;
    description: string;
    items: Array<{
      id: number;
      name: string;
      description: string;
      price: number;
      image_url: string;
      reviewsStat: ReviewsStat;
    }>;
  };
}

const MenuContainer: React.FC<MenuContainerProps> = ({ menu }) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        {menu.name}
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        {menu.description}
      </Typography>
      <Grid container spacing={2}>
        {menu.items.map((item) => (
          <Grid item xs={6} sm={4} key={item.id}>
            <MenuItemCard item={item} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MenuContainer;
