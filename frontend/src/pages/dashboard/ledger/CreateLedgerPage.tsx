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
  IconButton,
  Divider,
} from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import DeleteIcon from '@mui/icons-material/Delete';
import { API_SERVER } from '../../../utils/AxiosInstance';
import { useOwnerCanteenID } from '../utils/useOwnerCanteenID';

interface FormDataTypeI extends Partial<LedgerTypeI> {}

const CreateLedgerPage = () => {
  const [editMode, setEditMode] = useState(false);

  const [allMenus, setAllMenus] = useState<MenuTypeI[]>([]);
  const [menus, setMenus] = useState<MenuTypeI[]>([]);
  const [draggedItem, setDraggedItem] = useState<MenuTypeI | null>(null);
  const navigate = useNavigate();
  const params = useParams();
  const {ownerCanteenID} = useOwnerCanteenID();

  const [formData, setFormData] = useState<FormDataTypeI>({
    name: '',
    description: '',
    isActive: true,
    created_at: '',
  });

  useEffect(() => {
    if (params.ledgerId) {
      setEditMode(true);
    }
  }, [params]);

  // Fetch menu items
  const fetchLedger = async (ledgerId: string) => {
    try {
      const response = await fetch(`${API_SERVER}/api/v1/ledgers/${ledgerId}`);
      const data = await response.json();
      setFormData(data);
      setMenus(data.menus);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  // Fetch menu items
  const fetchMenus = async () => {
    try {
      const response = await fetch(`${API_SERVER}/api/v1/menus`);
      const data = await response.json();
      setAllMenus(data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  useEffect(() => {
    if (params.ledgerId) {
      fetchLedger(params.ledgerId);
    }
  }, [params]);

  useEffect(() => {
    fetchMenus();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'isActive' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const finalData = {
      ...formData,
      menus: menus.map((item) => ({
        id: item.id,
      })),
      canteen: {
        id: ownerCanteenID,
      },
      created_at: new Date().toISOString(),
    };

    try {
      const url = editMode
        ? `${API_SERVER}/api/v1/ledgers/${params.ledgerId}`
        : `${API_SERVER}/api/v1/ledgers`;

      const response = await fetch(url, {
        method: editMode ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalData),
      });

      if (response.ok) {
        toast.success('Ledger saved successfully');
        navigate('/dashboard/ledger');
      }
    } catch (error) {
      console.error('Error saving ledger:', error);
    }
  };

  // Handle drag start
  const handleDragStart = (e: React.DragEvent<HTMLButtonElement>, index: number) => {
    setDraggedItem(menus[index]);
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
      const item: MenuTypeI = JSON.parse(e.dataTransfer.getData('item'));
      setMenus([...new Set([...menus, item])]);
      return;
    }

    if (draggedItem === null) return;

    const newMenuItems = [...menus];
    const draggedItemIndex = menus.findIndex((item) => item.id === draggedItem.id);

    // Remove dragged item from array
    newMenuItems.splice(draggedItemIndex, 1);

    // Insert at new position
    newMenuItems.splice(index, 0, draggedItem);

    setMenus(newMenuItems);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">{editMode == false ? 'Create a new ledger' : 'Update a ledger'}</Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField name="name" label="Name" fullWidth required value={formData.name} onChange={handleInputChange} />
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

          <Grid item xs={12}>
            <FormControlLabel
              control={<Switch name="isActive" checked={formData.isActive} onChange={handleInputChange} />}
              label="Active"
            />
          </Grid>
        </Grid>

        <Divider sx={{ marginTop: 2, marginBottom: 2 }} />

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
            {allMenus
              .filter((i) => !menus.some((el) => el.id === i.id))
              .map((menu) => {
                return (
                  <ListItem
                    component={Button}
                    onClick={() => {
                      setMenus((prev) => [...prev, menu]);
                    }}
                    draggable
                    // onDragStart={(e: React.DragEvent<HTMLButtonElement>) => handleDragStart(e, index)}
                    //     onDragEnd={handleDragEnd}
                    //     onDragOver={handleDragOver}
                    //     onDrop={(e: React.DragEvent<HTMLButtonElement>) => handleDrop(e, index)}
                    onDragStart={(event) => {
                      event.dataTransfer.setData('item', JSON.stringify(menu));
                      event.dataTransfer.setData('source', 'all');
                    }}
                    key={menu.id}
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
                    <ListItemText primary={menu.name} secondary={`${menu.status}`} />
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
              if (menus.length === 0) {
                handleDrop(e, 0);
              }
            }}
            onDragOver={handleDragOver}
          >
            {menus &&
              menus.map((item, index) => {
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
                          setMenus((prev) => prev.filter((i) => i.id !== item.id));
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText primary={item.name} secondary={item.status} />
                  </ListItem>
                );
              })}
          </List>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 2 }}>
          <Button component={Link} to="/dashboard/ledger">
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

export default CreateLedgerPage;
