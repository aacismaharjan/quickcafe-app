/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Chip,
  Card,
  CardMedia,
  CardContent,
  Rating,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Modal,
  TextField,
} from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import axiosInstance, { API_SERVER } from '../utils/AxiosInstance';
import { toast } from 'react-toastify';
import { CartContext } from '../context/CartContext';
import { useAuth } from '../hooks/useAuth';
import { useLoading } from '../context/LoadingContext';
import RatingDisplay from '../components/molecules/RatingDisplay';

const MenuItemPage: React.FC = () => {
  const { menuItemId } = useParams<{ menuItemId: string }>();
  const [menuItem, setMenuItem] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
  const [modalOpen, setModalOpen] = useState(false);
  const [enableNewReview, setEnableNewReview] = useState(false); // This state should be set from the location context or passed down
  const cartContext = useContext(CartContext);
  const { user } = useAuth();
  const { setLoading } = useLoading();

  const location = useLocation();
  const state = location.state as { enableNewReview: boolean; orderDetail: any } | null;

  useEffect(() => {
    if (state?.enableNewReview) {
      setEnableNewReview(true);
    }
  }, [state]);

  useEffect(() => {
    const fetchMenuItem = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/menu-items/${menuItemId}`);
        setMenuItem(response.data);
        setReviews(response.data && response.data.reviews ? response.data.reviews : []);
      } catch (error) {
        console.error('Error fetching menu item data:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchFavorites = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/profile/favorites');
        const favoriteItems = response.data;
        setIsFavorite(favoriteItems.some((fav: any) => fav.menuItem.id === parseInt(menuItemId || '')));
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    if (menuItemId) {
      fetchMenuItem();
      fetchFavorites();
    }
  }, [menuItemId]);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setNewReview({ rating: 0, comment: '' }); // Reset the form
  };

  const handleReviewSubmit = async () => {
    try {
      setLoading(true);
      const tempReview = await axiosInstance
        .post('/reviews', {
          orderDetail: {
            id: state?.orderDetail.id,
          },
          menuItem: {
            id: state?.orderDetail.menuItem.id,
          },
          rating: newReview.rating,
          comment: newReview.comment,
          user: {
            id: user!.id,
          },
          createdAt: new Date(),
        })
        .finally(() => {
          setLoading(false);
        });
      toast.success('Review submitted successfully');
      handleCloseModal(); // Close the modal after submission
      setReviews((prev) => [...prev, { ...tempReview.data }]); // Update local state
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    }
  };

  if (!cartContext) {
    return null;
  }

  const { addToCart } = cartContext;

  const handleFavoriteToggle = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      if (isFavorite) {
        await axiosInstance.delete(`/profile/favorites/${menuItem.id}`);
        toast.info('Removed from favorites');
      } else {
        await axiosInstance.post('/profile/favorites', { menuItem: { id: menuItem.id } });
        toast.success('Added to favorites');
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error updating favorites:', error);
      toast.error('Failed to update favorites');
    }
  };

  return (
    <React.Fragment>
      <Box sx={{ flexGrow: 1, p: 2, bgcolor: 'white' }}>
        {menuItem && (
          <Card sx={{ maxWidth: 600, margin: 'auto', mb: 4, position: 'relative' }}>
            <CardMedia component="img" height="300" image={`${API_SERVER}/${menuItem.image_url}`} alt={menuItem.name} />
            <IconButton
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                color: isFavorite ? 'red' : 'grey',
              }}
              onClick={handleFavoriteToggle}
            >
              {isFavorite ? <Favorite /> : <FavoriteBorder />}
            </IconButton>
            <CardContent>
              <Typography variant="h4" component="div" gutterBottom>
                {menuItem.name}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                {menuItem.description}
              </Typography>
              <RatingDisplay {...menuItem.reviewsStat} />

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {menuItem.categories.map((category: any) => (
                  <Chip key={category.name} label={category.name} color="primary" />
                ))}
              </Box>

              <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                ${menuItem.price.toFixed(2)}
              </Typography>

              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mb: 1 }}
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.preventDefault();
                  if (menuItem) {
                    addToCart({
                      id: menuItem.id,
                      title: menuItem.name,
                      description: menuItem.description,
                      price: menuItem.price,
                      imageUrl: `${API_SERVER}/${menuItem.image_url}`,
                      quantity: 1,
                    });
                    toast.info('You have added an item to cart.');
                  }
                }}
              >
                Add to Cart
              </Button>
              <Button variant="outlined" color="secondary" fullWidth>
                Buy Now
              </Button>

              {/* Button to open the modal for a new review */}
              {enableNewReview && (
                <Button sx={{ mt: 1 }} variant="contained" color="secondary" fullWidth onClick={handleOpenModal}>
                  Add Review
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Reviews Section */}
        {reviews.length > 0 && (
          <Box sx={{ maxWidth: 600, margin: 'auto' }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Reviews
            </Typography>
            <List>
              {reviews.map((review) => (
                <ListItem key={review.id} alignItems="flex-start" sx={{ mb: 2 }}>
                  <ListItemAvatar>
                    <Avatar>
                      {review.user ? review.user?.firstName?.charAt(0) + review.user?.lastName?.charAt(0) : 'AN'}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="h6">
                        {review.user ? `${review.user?.firstName} ${review.user?.lastName}` : 'Anonymous'}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </Typography>
                        <Rating value={review.rating} readOnly precision={0.5} sx={{ mt: 1 }} />
                        <Typography variant="body1" sx={{ mt: 1 }}>
                          {review.comment}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {/* Modal for adding a new review */}
        <Modal open={modalOpen} onClose={handleCloseModal}>
          <Box
            sx={{
              bgcolor: 'white',
              borderRadius: 2,
              padding: 3,
              maxWidth: 400,
              margin: 'auto',
              mt: '20vh',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Write a Review
            </Typography>
            <Rating
              value={newReview.rating}
              onChange={(_, newValue) => setNewReview({ ...newReview, rating: newValue || 0 })}
              precision={0.5}
            />
            <TextField
              fullWidth
              label="Comment"
              variant="outlined"
              multiline
              rows={4}
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              sx={{ mt: 2 }}
            />
            <Button variant="contained" color="primary" onClick={handleReviewSubmit} sx={{ mt: 2 }}>
              Submit
            </Button>
          </Box>
        </Modal>
      </Box>
    </React.Fragment>
  );
};

export { MenuItemPage };
