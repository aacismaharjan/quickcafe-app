/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Paper, CircularProgress, Chip } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/AxiosInstance';
import { calculateGrandTotal } from './CheckoutPage';
import { useLoading } from '../context/LoadingContext';

interface OrderDetail {
  id: number;
  menuItem: {
    name: string;
    price: number;
  };
  quantity: number;
  unitPrice: number;
}

interface Order {
  id: number;
  orderDetails: OrderDetail[];
  grandTotal: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
}

const OrderConfirmationPage: React.FC = () => {
  const [order, setOrder] = useState<Order | null>(null);
  const { loading, setLoading } = useLoading();
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const orderId = new URLSearchParams(location.search).get('orderId');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/profile/orders/${orderId}`);
        setOrder(response.data);
      } catch (err) {
        setError('Failed to load order details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    } else {
      setError('Invalid order ID.');
      setLoading(false);
    }
  }, [orderId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography variant="h6" sx={{ color: 'red', textAlign: 'center', mt: 2 }}>
        {error}
      </Typography>
    );
  }

  if (!order) {
    return <Typography variant="h6">No order details available.</Typography>;
  }

  return (
    <React.Fragment>
      <Box sx={{ p: 2, maxWidth: 600, margin: 'auto' }}>
        <Typography variant="h4" sx={{ mb: 2, textAlign: 'center' }}>
          Order Confirmation
        </Typography>

        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Order Details
          </Typography>
          {order.orderDetails.map((item) => (
            <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body1">{item?.menuItem?.name}</Typography>
              <Typography variant="body1">{`x ${item?.quantity}`}</Typography>
              <Typography variant="body1">{`$${(item?.unitPrice * item?.quantity).toFixed(2)}`}</Typography>
            </Box>
          ))}
          <Typography variant="h6" sx={{ mt: 2 }}>
            Total: ${calculateGrandTotal(order.orderDetails).toFixed(2)}
          </Typography>
        </Paper>

        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6">Order Information</Typography>
          <Typography variant="body1">
            Status: <Chip label={order.orderStatus} color="primary" size="small" />
          </Typography>
          <Typography variant="body1">
            Payment Method: <Chip label={order.paymentMethod} color="secondary" size="small" />
          </Typography>
          <Typography variant="body1">
            Payment Status:{' '}
            <Chip
              label={order.paymentStatus}
              color={order.paymentStatus === 'COMPLETED' ? 'success' : 'warning'}
              size="small"
            />
          </Typography>
        </Paper>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button variant="contained" color="primary" onClick={() => navigate('/')}>
            Back to Home
          </Button>
          <Button variant="outlined" color="secondary" onClick={() => navigate('/my-order-history')}>
            View Order History
          </Button>
        </Box>
      </Box>
    </React.Fragment>
  );
};

export { OrderConfirmationPage };
