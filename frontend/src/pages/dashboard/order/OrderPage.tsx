import React, { useState, useEffect } from 'react';
import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  Typography,
  Chip,
  MenuItem,
  Menu,
} from '@mui/material';
import { RemoveRedEye } from '@mui/icons-material';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { StyledTableCell, StyledTableRow } from '../menu-item/MenuDetailPage';
import { getPrice } from '../../CartPage';
import { API_SERVER } from '../../../utils/AxiosInstance';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useOwnerCanteenID } from '../utils/useOwnerCanteenID';
import { OrderStatus, PaymentStatus } from '../utils/utils';

// Utility Function to get Status Color
const getStatusColor = (status: string) => {
  switch (status) {
    case OrderStatus.RECEIVED:
      return 'info';
    case OrderStatus.IN_PROGRESS:
      return 'warning';
    case OrderStatus.COMPLETED:
      return 'success';
    case OrderStatus.CANCELED:
      return 'error';
    case PaymentStatus.PAID:
      return 'success';
    case PaymentStatus.FAILED:
      return 'error';
    default:
      return 'default';
  }
};

// Reusable Chip Menu Component
interface ChipMenuProps {
  label?: string;
  options: string[];
  selectedOption?: string;
  onSelect?: (option: string) => void;
}

const ChipMenu: React.FC<ChipMenuProps> = ({ label = 'Dashboard', options, selectedOption, onSelect }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (option?: string) => {
    setAnchorEl(null);
    if (option && onSelect) {
      onSelect(option);
    }
  };

  return (
    <div>
      <Chip
        label={selectedOption || label}
        onClick={handleClick}
        deleteIcon={<ArrowDropDownIcon />}
        onDelete={handleClick}
        color={getStatusColor(selectedOption || '')}
        size="small"
      />
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => handleClose()}
        MenuListProps={{ 'aria-labelledby': 'chip-menu' }}
      >
        {options.map((option, index) => (
          <MenuItem key={index} onClick={() => handleClose(option)}>
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

// Order Page Component
const OrderPage: React.FC = () => {
  const [orders, setOrders] = useState<OrderTypeI[]>([]);
  const navigate = useNavigate();
  const { ownerCanteenID } = useOwnerCanteenID();

  // Fetch Orders
  const fetchOrders = async (): Promise<void> => {
    try {
      const response = await fetch(`${API_SERVER}/api/v1/canteens/${ownerCanteenID}/orders`);
      const data: OrderTypeI[] = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  // Update Order
  const updateOrder = async (orderId: number, updatedFields: Partial<OrderTypeI>): Promise<void> => {
    try {
      const response = await fetch(`${API_SERVER}/api/v1/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFields),
      });

      if (response.ok) {
        setOrders((prevOrders) =>
          prevOrders.map((order) => (order.id === orderId ? { ...order, ...updatedFields } : order))
        );
      } else {
        console.error('Error updating order');
      }
    } catch (error) {
      console.error('Error updating order:', error);
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
              <StyledTableCell>Payment Status</StyledTableCell>
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
                  <StyledTableCell>{getPrice(totalPrice)}</StyledTableCell>
                  <StyledTableCell>
                    <ChipMenu
                      label="Status"
                      options={Object.values(OrderStatus)}
                      selectedOption={order.orderStatus}
                      onSelect={(value) => updateOrder(order.id, { orderStatus: value as OrderStatus })}
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    <ChipMenu
                      label="Payment Status"
                      options={Object.values(PaymentStatus)}
                      selectedOption={order.paymentStatus}
                      onSelect={(value) => updateOrder(order.id, { paymentStatus: value as PaymentStatus })}
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    <Typography variant="caption" color="textSecondary">
                      {order.paymentMethod}
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell>
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
