import React, { useEffect, useState, useContext } from 'react';
import { Box, Typography, Paper, Divider, Button, Chip } from '@mui/material';
import axiosInstance, { API_SERVER } from '../utils/AxiosInstance';
import ReviewIcon from '@mui/icons-material/RateReview';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext'; // Ensure your context is properly imported
import { useLoading } from '../context/LoadingContext';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
}

interface OrderDetail {
  id: number;
  menuItem: MenuItem;
  quantity: number;
  unitPrice: number;
}

interface Order {
  id: number;
  orderStatus: string;
  orderDetails: OrderDetail[];
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
}

const MyOrderHistory: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const cartContext = useContext(CartContext); // Use context for cart functionality
  const { loading, setLoading } = useLoading();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/profile/orders`);
        setOrders(response.data);
      } catch (err: unknown) {
        console.log(err);
        setError('Failed to fetch order history. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (!cartContext) {
    return <></>;
  }

  const { addToCart, clearCart } = cartContext;

  const handleReorder = (order: Order) => {
    clearCart();
    order.orderDetails.forEach((item) => {
      addToCart({
        id: item.id,
        title: item.menuItem.name,
        description: item.menuItem.description,
        price: item.menuItem.price,
        imageUrl: `${API_SERVER}/${item.menuItem.image_url}`,
        quantity: item.quantity,
      });
    });
    navigate('/checkout');
  };

  if (loading) {
    return <Typography variant="h6"></Typography>;
  }

  if (error) {
    return (
      <Typography variant="h6" color="error">
        {error}
      </Typography>
    );
  }

  return (
    <React.Fragment>
      <Box sx={{ p: 2, maxWidth: 800, margin: 'auto' }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          My Order History
        </Typography>

        {orders.map((order) => (
          <Paper key={order.id} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Order ID: {order.id}
            </Typography>
            <Box sx={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <Typography variant="body1">
                <Chip label={`Status: ${order.orderStatus}`} color="primary" size="small" />
              </Typography>
              <Typography variant="body1">
                <Chip label={`Payment Method: ${order.paymentMethod}`} color="secondary" size="small" />
              </Typography>
              <Typography variant="body1">
                <Chip
                  label={` Payment Status: ${order.paymentStatus}`}
                  color={order.paymentStatus === 'COMPLETED' ? 'success' : 'warning'}
                  size="small"
                />
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Order Date: {new Date(order.createdAt).toLocaleDateString()}
            </Typography>

            {order.orderDetails.map((item) => (
              <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body1">{item.menuItem.name}</Typography>
                    <ReviewIcon
                      sx={{ ml: 1, cursor: 'pointer' }}
                      onClick={() =>
                        navigate(`/menu-items/${item.menuItem.id}`, {
                          state: { enableNewReview: true, orderDetail: item },
                        })
                      }
                    />
                  </Box>
                  <Typography variant="body2">Quantity: {item.quantity}</Typography>
                </Box>
                <Typography variant="body1">${(item.unitPrice * item.quantity).toFixed(2)}</Typography>
              </Box>
            ))}
            <Divider sx={{ my: 1 }} />
            <Button variant="outlined" color="primary" onClick={() => handleReorder(order)}>
              Reorder
            </Button>
          </Paper>
        ))}
      </Box>
    </React.Fragment>
  );
};

export { MyOrderHistory };
