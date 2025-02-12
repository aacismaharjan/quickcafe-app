/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Switch,
  FormControlLabel,
  ListItem,
  List,
  ListItemText,
  Avatar,
  ListItemAvatar,
  IconButton,
} from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import DeleteIcon from '@mui/icons-material/Delete';
import { API_SERVER } from '../../../utils/AxiosInstance';
import { useOwnerCanteenID } from '../utils/useOwnerCanteenID';

interface FormDataTypeI extends Partial<MenuTypeI> {}

const CreateMenuPage = () => {
  const [editMode, setEditMode] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItemTypeI[]>([]);
  const [allMenuItems, setAllMenuItems] = useState<MenuItemTypeI[]>([]);
  const [draggedItem, setDraggedItem] = useState<MenuItemTypeI | null>(null);
  const { ownerCanteenID } = useOwnerCanteenID();
  const navigate = useNavigate();
  const params = useParams();

  const [formData, setFormData] = useState<FormDataTypeI>({
    name: '',
    status: '',
    is_active: true,
    created_at: '',
  });

  useEffect(() => {
    if (params.menuId) {
      setEditMode(true);
    }
  }, [params]);

  // Fetch menu items
  const fetchMenu = async (menuId: string) => {
    try {
      const response = await fetch(`${API_SERVER}/api/v1/menus/${menuId}`);
      const data = await response.json();
      setFormData(data);
      setMenuItems(data.items);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  // Fetch menu items
  const fetchMenuItems = async () => {
    try {
      const response = await fetch(`${API_SERVER}/api/v1/menu-items`);
      const data = await response.json();
      setAllMenuItems(data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  useEffect(() => {
    if (params.menuId) {
      fetchMenu(params.menuId);
    }
  }, [params]);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'is_active' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalData = {
      ...formData,
      items: menuItems.map((item) => ({
        id: item.id,
      })),
      created_at: new Date().toISOString(),
      canteen: { id: ownerCanteenID },
    };

    try {
      const url = editMode ? `${API_SERVER}/api/v1/menus/${params.menuId}` : `${API_SERVER}/api/v1/menus`;

      const response = await fetch(url, {
        method: editMode ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalData),
      });

      if (response.ok) {
        toast.success('Menu saved successfully');
        navigate('/dashboard/menu');
      }
    } catch (error) {
      console.error('Error saving menu item:', error);
    }
  };

  // Handle drag start
  const handleDragStart = (e: React.DragEvent<HTMLButtonElement>, index: number) => {
    setDraggedItem(menuItems[index]);
    e.currentTarget.style.opacity = '0.4';
  };

  // Handle drag end
  const handleDragEnd = (e: React.DragEvent<HTMLButtonElement>) => {
    e.currentTarget.style.opacity = '1';
    setDraggedItem(null);
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent<any>) => {
    e.preventDefault();
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent<any>, index: number) => {
    console.log(e, index);
    e.preventDefault();

    if (e.dataTransfer.getData('source') === 'all') {
      const item: MenuItemTypeI = JSON.parse(e.dataTransfer.getData('item'));
      setMenuItems([...new Set([...menuItems, item])]);
      return;
    }

    if (draggedItem === null) return;

    const newMenuItems = [...menuItems];
    const draggedItemIndex = menuItems.findIndex((item) => item.id === draggedItem.id);

    // Remove dragged item from array
    newMenuItems.splice(draggedItemIndex, 1);

    // Insert at new position
    newMenuItems.splice(index, 0, draggedItem);

    setMenuItems(newMenuItems);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">{editMode == false ? 'Create a new menu' : 'Update a menu'}</Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField name="name" label="Name" fullWidth required value={formData.name} onChange={handleInputChange} />
          </Grid>

          <Grid item xs={12}>
            <TextField
              name="status"
              label="Status"
              fullWidth
              multiline
              rows={3}
              required
              value={formData.status}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={<Switch name="is_active" checked={formData.is_active} onChange={handleInputChange} />}
              label="Active"
            />
          </Grid>
        </Grid>

        <Box sx={{ marginTop: 2 }}>
          <Typography variant="h6">Menu Items</Typography>

          {/* <Box sx={{ display: 'flex', gap: 2 }}>
              <Autocomplete
                disablePortal
                fullWidth
                onChange={(event, newValue) => {
                  setMenuItems([... new Set(newValue)]);
                }}
                getOptionLabel={(option) => option.name}
                options={allMenuItems.map((item) => item)} // Change this line
                renderInput={(params) => <TextField {...params} label="Menu Items" fullWidth />}
                isOptionEqualToValue={(option, value) => option.id === value.id}
              />

              <Button variant="contained">
                <Add />
              </Button>
            </Box> */}

          <Typography sx={{ display: 'block', mt: 2 }}>Available Menu Items: </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 1, mt: 0 }}>
            {allMenuItems
              .filter((i) => !menuItems.some((el) => el.id === i.id))
              .map((item) => {
                return (
                  <ListItem
                    component={Button}
                    onClick={() => {
                      setMenuItems((prev) => [...prev, item]);
                    }}
                    draggable
                    // onDragStart={(e: React.DragEvent<HTMLButtonElement>) => handleDragStart(e, index)}
                    //     onDragEnd={handleDragEnd}
                    //     onDragOver={handleDragOver}
                    //     onDrop={(e: React.DragEvent<HTMLButtonElement>) => handleDrop(e, index)}
                    onDragStart={(event) => {
                      event.dataTransfer.setData('item', JSON.stringify(item));
                      event.dataTransfer.setData('source', 'all');
                    }}
                    key={item.id}
                    sx={{
                      border: '1px solid #ccc',
                      borderRadius: '8px',
                      flexBasis: '200px',
                      flexGrow: 1,
                      padding: '8px',
                      '& .MuiListItemText-root': {
                        margin: 0,
                      },
                      '& .MuiListItemText-primary': {
                        fontSize: '14px',
                        lineHeight: 1.2,
                      },
                      '& .MuiListItemText-secondary': {
                        fontSize: '14px',
                        lineHeight: 1.2,
                      },
                    }}
                  >
                    <ListItemText primary={item.name} secondary={`Rs. ${item.price}`} />
                  </ListItem>
                );
              })}
          </Box>
        </Box>

        <Grid item xs={12} md={6}>
          <Typography sx={{ display: 'block', mt: 2 }}>Selected Menu Items: </Typography>
          <List
            sx={{
              display: 'flex',
              gap: 1,
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '8px',
              minHeight: '64px',
              flexWrap: 'wrap',
              flexDirection: 'column',
            }}
            onDrop={(e) => {
              if (menuItems.length === 0) {
                handleDrop(e, 0);
              }
            }}
            onDragOver={handleDragOver}
          >
            {menuItems &&
              menuItems.map((item, index) => {
                const image_url = `${API_SERVER}/${item.image_url}`;
                return (
                  <ListItem
                    component={Button}
                    draggable
                    onDragStart={(e: React.DragEvent<HTMLButtonElement>) => handleDragStart(e, index)}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                    onDrop={(e: React.DragEvent<HTMLButtonElement>) => handleDrop(e, index)}
                    key={item.id}
                    sx={{
                      border: '1px solid #ccc',
                      borderRadius: '8px',
                      padding: '8px',
                    }}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => {
                          setMenuItems((prev) => prev.filter((i) => i.id !== item.id));
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar src={image_url}></Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={item.name} secondary={item.description} />
                  </ListItem>
                );
              })}
          </List>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 2 }}>
          <Button component={Link} to="/dashboard/menu">
            Go Back
          </Button>
          <Button type="submit" variant="contained">
            Submit
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default CreateMenuPage;
