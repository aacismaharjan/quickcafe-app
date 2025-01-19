import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon
} from '@mui/icons-material';

const DashboardMenuDetailPage = () => {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
    preparation_time_in_min: '',
    is_active: true
  });

  // Fetch menu items
  const fetchMenuItems = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/menu-items');
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const handleOpen = (item = null) => {
    if (item) {
      setFormData(item);
      setSelectedItem(item);
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        image_url: '',
        preparation_time_in_min: '',
        is_active: true
      });
      setSelectedItem(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedItem(null);
  };

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'is_active' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = selectedItem 
        ? `http://localhost:8080/api/menu-items/${selectedItem.id}`
        : 'http://localhost:8080/api/menu-items';
      
      const response = await fetch(url, {
        method: selectedItem ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchMenuItems();
        handleClose();
      }
    } catch (error) {
      console.error('Error saving menu item:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:8080/api/menu-items/${id}`, {
        method: 'DELETE',
      });
      fetchMenuItems();
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting menu item:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Menu Items</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add Item
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Prep Time (min)</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <CardMedia
                    component="img"
                    sx={{ width: 60, height: 60, objectFit: 'cover' }}
                    image={item.image_url}
                    alt={item.name}
                  />
                </TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>${item.price}</TableCell>
                <TableCell>{item.preparation_time_in_min}</TableCell>
                <TableCell>
                  <Switch
                    checked={item.is_active}
                    disabled
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(item)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    onClick={() => {
                      setSelectedItem(item);
                      setDeleteDialogOpen(true);
                    }} 
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create/Edit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedItem ? 'Edit Menu Item' : 'Add Menu Item'}
          <IconButton
            sx={{ position: 'absolute', right: 8, top: 8 }}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="name"
                  label="Name"
                  fullWidth
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="description"
                  label="Description"
                  fullWidth
                  multiline
                  rows={3}
                  required
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="price"
                  label="Price"
                  type="number"
                  fullWidth
                  required
                  value={formData.price}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="preparation_time_in_min"
                  label="Preparation Time (minutes)"
                  type="number"
                  fullWidth
                  required
                  value={formData.preparation_time_in_min}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="image_url"
                  label="Image URL"
                  fullWidth
                  value={formData.image_url}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleInputChange}
                    />
                  }
                  label="Active"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              {selectedItem ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {selectedItem?.name}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={() => handleDelete(selectedItem?.id)} 
            color="error" 
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export {DashboardMenuDetailPage};