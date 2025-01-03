import React, { useContext } from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { toast } from 'react-toastify';
import { API_SERVER } from '../../utils/AxiosInstance';
import RatingDisplay from './RatingDisplay';

interface MenuItemCardProps {
  item: {
    id: number;
    name: string;
    description: string;
    price: number;
    image_url: string;
    reviewsStat: ReviewsStat;
  };
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item }) => {
  const cartContext = useContext(CartContext);

  if (!cartContext) {
    return null;
  }

  const { addToCart } = cartContext;

  return (
    <Link to={`/menu-items/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <Card
        sx={{
          m: 2,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative', // Needed for positioning the heart icon
          '&.MuiCard-root': {
            margin: 0,
          },
        }}
      >
        <CardMedia component="img" height="140" image={`${API_SERVER}/${item.image_url}`} alt={item.name} />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h6">{item.name}</Typography>
          <RatingDisplay {...item.reviewsStat} />
          <Typography variant="body2" color="text.secondary">
            {item.description}
          </Typography>
          <Typography variant="h6" color="primary">
            ${item.price.toFixed(2)}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button
              variant="outlined"
              fullWidth
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();

                if (item) {
                  addToCart({
                    id: item.id,
                    title: item.name,
                    description: item.description,
                    price: item.price,
                    imageUrl: `${API_SERVER}/${item.image_url}`,
                    quantity: 1,
                  });

                  toast.info('You have added an item to cart.');
                }
              }}
            >
              Add to Cart
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Link>
  );
};

export default MenuItemCard;
