import { useState, useEffect } from 'react';
import { Box, IconButton, Paper, Table, TableBody, TableContainer, TableHead, Typography, Chip } from '@mui/material';
import { Edit as EditIcon, RemoveRedEye } from '@mui/icons-material';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { StyledTableCell, StyledTableRow } from '../menu-item/MenuDetailPage';

const OrderPage = () => {
  const [orders, setOrders] = useState<OrderTypeI[]>([]);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/orders');
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" mb={3}>
        Orders
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <StyledTableRow>
              <StyledTableCell>ID</StyledTableCell>
              <StyledTableCell>User</StyledTableCell>
              <StyledTableCell>Created At</StyledTableCell>
              <StyledTableCell>Total Price</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell>Payment Method</StyledTableCell>
              <StyledTableCell>Actions</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => {
              const created_at_date = moment(order.createdAt).format('DD MMM YYYY');
              const totalPrice = order.orderDetails.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
              return (
                <StyledTableRow key={order.id}>
                  <StyledTableCell>{order.id}</StyledTableCell>
                  <StyledTableCell>
                    {order.user.firstName} {order.user.lastName}
                  </StyledTableCell>
                  <StyledTableCell>{created_at_date}</StyledTableCell>
                  <StyledTableCell>${totalPrice.toFixed(2)}</StyledTableCell>
                  <StyledTableCell>
                    <Chip
                      variant="outlined"
                      color={order.orderStatus === 'Pending' ? 'warning' : 'success'}
                      size="small"
                      label={order.orderStatus}
                    />
                  </StyledTableCell>
                  <StyledTableCell>{order.paymentMethod}</StyledTableCell>
                  <StyledTableCell>
                    <IconButton color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => navigate('/dashboard/orders/' + order.id)}>
                      <RemoveRedEye />
                    </IconButton>
                  </StyledTableCell>
                </StyledTableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export { OrderPage };
