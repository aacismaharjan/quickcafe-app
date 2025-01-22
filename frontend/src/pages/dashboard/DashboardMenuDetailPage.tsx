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
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Close as CloseIcon } from '@mui/icons-material';
import DashboardLayout from './DashboardLayout';
import moment from "moment";
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const DashboardMenuDetailPage = () => {
  const [items, setItems] = useState<MenuItemTypeI[]>([]);

  // Fetch menu items
  const fetchMenuItems = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/menu-items');
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);


  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:8080/api/v1/menu-items/${id}`, {
        method: 'DELETE',
      }).then(() => {
        toast.success("Menu item deleted successfully");
      });
      fetchMenuItems();
    } catch (error) {
      console.error('Error deleting menu item:', error);
    }
  };

  return (
    <DashboardLayout>
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
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Prep Time (min)</TableCell>
                <TableCell>Categories</TableCell>
                <TableCell>Reviews</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align='center'>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => {
                const image_url = `http://localhost:8080/${item.image_url}`;
                const created_at_date = moment(item.created_at).format('DD MMM YYYY');
                const created_at_time = moment(item.created_at).format("h:mm a");
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      {item.id}
                    </TableCell>
                    <TableCell>
                      <Box sx={{display: "flex", flexDirection: "row", gap: "8px"}}>
                      <CardMedia
                        component="img"
                        sx={{ width: 60, height: 60, objectFit: 'cover', borderRadius: "8px" }}
                        image={image_url}
                        alt={item.name}
                      />
                      <span>{item.name}</span>
                      </Box>
                    </TableCell>
                    <TableCell>
                    <div>{created_at_date}</div>
                    <div>{created_at_time}</div>
                    </TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>${item.price}</TableCell>
                    <TableCell>{item.preparation_time_in_min}</TableCell>
                    <TableCell>
                      <Box sx={{display: "flex", flexDirection: "row", gap: "8px", maxWidth: 180, flexWrap: "wrap"}}>
                      {item.categories.map((category) => (<div>
                        <Chip variant="filled" color="default" size="small" label={category.name}/>
                      </div>))}
                      </Box>
                    </TableCell>
                    <TableCell>
                    <Rating name="half-rating-read" defaultValue={item.reviewsStat.rating} precision={0.5} readOnly />
                  <div><em>({item.reviewsStat.reviewersNo} reviews)</em></div>
                    </TableCell>
                    <TableCell>
                      <Chip variant="outlined" color={item.is_active === true ? "success": "error"} size="small" label={item.is_active === true ? "Active" : "Disabled"}/>
                    </TableCell>
                    <TableCell sx={{minWidth: 120}} align='center'>
                      <IconButton component={Link} to={`/dashboard/menu-detail/${item.id}/edit`} color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          // setSelectedItem(item);
                          // setDeleteDialogOpen(true);
                          handleDelete(item.id);
                        }}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </DashboardLayout>
  );
};

export { DashboardMenuDetailPage };
