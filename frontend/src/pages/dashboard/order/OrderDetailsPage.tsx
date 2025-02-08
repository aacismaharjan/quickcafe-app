import { useState, useEffect } from 'react';
import { Box, Button, Paper, Table, TableBody, TableContainer, TableHead, Typography, Chip } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import { toast } from 'react-toastify';
import { StyledTableCell, StyledTableRow } from '../menu-item/MenuDetailPage';

const OrderDetailsPage = () => {
  const { id } = useParams<{ id: string }>(); // Get the order ID from the URL
  const [order, setOrder] = useState<OrderTypeI | null>(null);
  const navigate = useNavigate();

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/orders/${id}`);
      const data: OrderTypeI = await response.json();
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast.error('Error fetching order details');
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  if (!order) {
    return <div>Loading...</div>;
  }

  const totalPrice = order.orderDetails.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const created_at_date = moment(order.createdAt).format('DD MMM YYYY');

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" mb={3}>
        Order Details
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6">Order ID: {order.id}</Typography>
        <Typography variant="subtitle1" mt={2}>
          User: {order.user.firstName} {order.user.lastName}
        </Typography>
        <Typography variant="subtitle2" mt={1}>
          Created At: {created_at_date}
        </Typography>
        <Typography variant="subtitle2" mt={1}>
          Payment Method: {order.paymentMethod}
        </Typography>
        <Typography variant="subtitle2" mt={1}>
        Payment:{" "}
          <Chip
            variant="outlined"
            color={order.paymentStatus === 'Completed' ? 'warning' : 'success'}
            label={order.paymentStatus}
            size="small"
          />
        </Typography>
        <Typography variant="subtitle2" mt={1}>
          Order Status:{' '}
          <Chip
            variant="outlined"
            color={order.orderStatus === 'Pending' ? 'warning' : 'success'}
            label={order.orderStatus}
            size="small"
          />
        </Typography>

        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>
                  <strong>Image</strong>
                </StyledTableCell>
                <StyledTableCell>
                  <strong>Item</strong>
                </StyledTableCell>
                <StyledTableCell>
                  <strong>Quantity</strong>
                </StyledTableCell>
                <StyledTableCell>
                  <strong>Unit Price</strong>
                </StyledTableCell>
                <StyledTableCell>
                  <strong>Total</strong>
                </StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {order.orderDetails.map((orderDetail) => (
                <StyledTableRow key={orderDetail.id}>
                  <StyledTableCell>
                    <img
                      src={`http://localhost:8080/${orderDetail.menuItem.image_url}`}
                      alt={orderDetail.menuItem.name}
                      style={{ width: 50, height: 50, objectFit: 'cover' }}
                    />
                  </StyledTableCell>
                  <StyledTableCell>{orderDetail.menuItem.name}</StyledTableCell>
                  <StyledTableCell>{orderDetail.quantity}</StyledTableCell>
                  <StyledTableCell>${orderDetail.unitPrice.toFixed(2)}</StyledTableCell>
                  <StyledTableCell>${(orderDetail.quantity * orderDetail.unitPrice).toFixed(2)}</StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">Total Price: ${totalPrice.toFixed(2)}</Typography>
          <Button sx={{ mt: 2 }} variant="contained" color="primary" onClick={() => navigate('/dashboard/orders')}>
            Back to Orders
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export { OrderDetailsPage };
