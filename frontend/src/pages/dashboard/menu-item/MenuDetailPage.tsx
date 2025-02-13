import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  CardMedia,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Rating,
  styled,
  tableCellClasses,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getPrice } from '../../CartPage';
import { API_SERVER } from '../../../utils/AxiosInstance';
import { useOwnerCanteenID } from '../utils/useOwnerCanteenID';

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.grey.A700,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const MenuDetailPage = () => {
  const { ownerCanteenID } = useOwnerCanteenID();
  const [items, setItems] = useState<MenuItemTypeI[]>([]);

  // Fetch menu items
  const fetchMenuItems = async () => {
    try {
      const response = await fetch(`${API_SERVER}/api/v1/canteens/${ownerCanteenID}/menu-items`);
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await fetch(`${API_SERVER}/api/v1/menu-items/${id}`, {
        method: 'DELETE',
      }).then(() => {
        toast.success('Menu item deleted successfully');
      });
      fetchMenuItems();
    } catch (error) {
      console.error('Error deleting menu item:', error);
    }
  };

  return (
    <React.Fragment>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5">Menu Items</Typography>
          <Button component={Link} to="/dashboard/menu-detail/create" variant="contained" startIcon={<AddIcon />}>
            Add Item
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>ID</StyledTableCell>
                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell>Created</StyledTableCell>
                <StyledTableCell>Description</StyledTableCell>
                <StyledTableCell>Prep.</StyledTableCell>
                <StyledTableCell>Categories</StyledTableCell>
                <StyledTableCell>Reviews</StyledTableCell>
                <StyledTableCell>Status</StyledTableCell>
                <StyledTableCell align="center">Actions</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => {
                const image_url = `${API_SERVER}/${item.image_url}`;
                const created_at_date = moment(item.created_at).format('DD MMM YYYY');
                const created_at_time = moment(item.created_at).format('h:mm a');
                return (
                  <StyledTableRow key={item.id}>
                    <StyledTableCell>{item.id}</StyledTableCell>
                    <StyledTableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
                        <CardMedia
                          component="img"
                          sx={{ width: 60, height: 60, objectFit: 'cover', borderRadius: '8px' }}
                          image={image_url}
                          alt={item.name}
                        />
                        <span>
                          {item.name} <div>{getPrice(item.price)}</div>
                        </span>
                      </Box>
                    </StyledTableCell>
                    <StyledTableCell>
                      <div>{created_at_date}</div>
                      <div>{created_at_time}</div>
                    </StyledTableCell>
                    <StyledTableCell>{item.description}</StyledTableCell>
                    <StyledTableCell>{item.preparation_time_in_min} mins</StyledTableCell>
                    <StyledTableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'row', gap: '8px', maxWidth: 180, flexWrap: 'wrap' }}>
                        {item.categories.map((category) => (
                          <div key={category.id}>
                            <Chip variant="filled" color="default" size="small" label={category.name} />
                          </div>
                        ))}
                      </Box>
                    </StyledTableCell>
                    <StyledTableCell>
                      <Rating name="half-rating-read" defaultValue={item.reviewsStat.rating} precision={0.5} readOnly />
                      <div>
                        <em>({item.reviewsStat.reviewersNo} reviews)</em>
                      </div>
                    </StyledTableCell>
                    <StyledTableCell>
                      <Chip
                        variant="outlined"
                        color={item.is_active === true ? 'success' : 'error'}
                        size="small"
                        label={item.is_active === true ? 'Active' : 'Disabled'}
                      />
                    </StyledTableCell>
                    <StyledTableCell sx={{ minWidth: 120 }} align="center">
                      <IconButton component={Link} to={`/dashboard/menu-detail/${item.id}/edit`} color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          handleDelete(item.id);
                        }}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </React.Fragment>
  );
};

export { MenuDetailPage };
