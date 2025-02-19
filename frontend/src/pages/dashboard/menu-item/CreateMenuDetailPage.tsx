/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Switch,
  FormControlLabel,
  Autocomplete,
  Chip,
} from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import FileUploadButtonWithInfo from '../../../components/molecules/FileUploadButton';
import { API_SERVER } from '../../../utils/AxiosInstance';
import { useOwnerCanteenID } from '../utils/useOwnerCanteenID';


interface FormDataTypeI extends Partial<MenuItemTypeI> {
  image_file?: any;
}

const CreateMenuDetailPage = () => {
  const [editMode, setEditMode] = useState(false);
  const [categories, setCategories] = useState<CategoryTypeI[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<CategoryTypeI[]>([]);
  const navigate = useNavigate();
  const params = useParams();
  // const {canteenID} = useStoredIDs();
  const {ownerCanteenID} = useOwnerCanteenID();
  console.log(params);

  const [formData, setFormData] = useState<FormDataTypeI>({
    name: '',
    description: '',
    price: undefined,
    image_url: '',
    preparation_time_in_min: undefined,
    is_active: true,
  });

  useEffect(() => {
    if (params.menuItemId) {
      setEditMode(true);
    }
  }, [params]);
  // Fetch menu items
  const fetchMenuItem = async (menuItemId: string) => {
    try {
      const response = await fetch(`${API_SERVER}/api/v1/menu-items/${menuItemId}`);
      const data = await response.json();
      setSelectedCategories(data.categories);
      setFormData(data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_SERVER}/api/v1/categories`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  useEffect(() => {
    if (params.menuItemId) {
      fetchMenuItem(params.menuItemId);
    }
  }, [params]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' || type === 'radio' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const url = editMode
        ? `${API_SERVER}/api/v1/menu-items/${params.menuItemId}`
        : `${API_SERVER}/api/v1/menu-items`;

      delete formData.reviews;
      delete formData.reviewsStat;
      delete formData.categories;

      // Create a new FormData object
      const tempFormData = new FormData();
      tempFormData.append(
        'menuItem',
        JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: formData.price,
          preparation_time_in_min: formData.preparation_time_in_min,
          is_active: formData.is_active,
          canteen: {id: ownerCanteenID}
        })
      );

      // Append the file (image_file) to the FormData
      if (formData.image_file) {
        tempFormData.append('image_file', formData.image_file);
      }

      // Append the categories as an array
      if (selectedCategories.length > 0) {
        tempFormData.append('categories', JSON.stringify(selectedCategories));
      }

      const response = await fetch(url, {
        method: editMode ? 'PATCH' : 'POST',
        body: tempFormData,
      });

      if (response.ok) {
        toast.success('Menu item saved successfully');
        navigate('/dashboard/menu-detail');
      }
    } catch (error) {
      console.error('Error saving menu item:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">{editMode == false ? 'Create a new menu item' : 'Update a menu item'}</Typography>
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
          <Grid item xs={6}>
            <TextField
              name="price"
              label="Price"
              type="number"
              fullWidth
              required
              value={formData.price || ''}
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
              value={formData.preparation_time_in_min || ''}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              multiple
              fullWidth
              value={selectedCategories}
              onChange={(_, newValue) => {
                setSelectedCategories([...new Set(newValue)]);
              }}
              options={categories.map((option) => option)}
              getOptionLabel={(option) => option.name}
              renderTags={(tagValue, getTagProps) =>
                tagValue.map((option, index) => {
                  const { key, ...tagProps } = getTagProps({ index });
                  return <Chip key={key} label={option.name} {...tagProps} />;
                })
              }
              style={{ width: 500 }}
              renderInput={(params) => <TextField {...params} label="Categories" placeholder="Favorites" fullWidth />}
              isOptionEqualToValue={(option, value) => option.id === value.id}
            />
          </Grid>
          <Grid item xs={12}>

            <FileUploadButtonWithInfo
              label="Upload product photo"
              onFileChange={(file: File) => {
                setFormData((prev) => ({ ...prev, image_file: file }));
              }} // Pass the file change handler
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={<Switch name="is_active" checked={formData.is_active} onChange={handleInputChange} />}
              label="Active"
            />
          </Grid>
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 2 }}>
          <Button component={Link} to="/dashboard/menu-detail">
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

export { CreateMenuDetailPage };
