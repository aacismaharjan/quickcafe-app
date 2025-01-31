/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { TextField, Button, Typography, Box, Container } from '@mui/material';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/AxiosInstance';
import { useLoading } from '../../context/LoadingContext';
import DashboardLayout from './DashboardLayout';

const DashboardSettingPage: React.FC = () => {
  const [canteen, setCanteen] = useState<any>(null);
  const navigate = useNavigate();
  const { loading, setLoading } = useLoading();

  // Fetch canteen data
  useEffect(() => {
    const fetchCanteen = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/canteens/3'); // Assuming ID = 3
        setCanteen(response.data);
      } catch (err) {
        console.log('Failed to fetch canteen data.', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCanteen();
  }, []);

  // Handle input change
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCanteen((prevCanteen: any) => ({
      ...prevCanteen,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setLoading(true);
      await axiosInstance.put(`/canteens/${canteen.id}`, canteen); // Update canteen
      toast.info('Canteen details updated successfully!');
    } catch (err) {
      console.log(err);
      toast.error('Failed to update canteen details.');
    } finally {
      setLoading(false);
      navigate('/dashboard');
    }
  };


  return (
    <DashboardLayout>
      <Container maxWidth="xl" disableGutters>
        <Box sx={{ padding: 2 }}>
          <Typography variant="h5" gutterBottom sx={{ paddingBottom: 1 }}>
            Canteen Settings
          </Typography>
          <form onSubmit={handleSubmit}>
            <Box mb={2}>
              <TextField
                label="Canteen Name"
                name="name"
                value={canteen?.name || ''}
                onChange={handleChange}
                fullWidth
                required
              />
            </Box>
            <Box mb={2}>
              <TextField
                label="Image URL"
                name="image_url"
                value={canteen?.image_url || ''}
                onChange={handleChange}
                fullWidth
              />
            </Box>
            <Box mb={2}>
              <TextField
                label="Address"
                name="address"
                value={canteen?.address || ''}
                onChange={handleChange}
                fullWidth
                required
              />
            </Box>
            <Box mb={2}>
              <TextField
                label="Phone Number"
                name="phone_no"
                value={canteen?.phone_no || ''}
                onChange={handleChange}
                fullWidth
                required
              />
            </Box>
            <Box mb={2}>
              <TextField
                label="Email"
                name="email"
                type="email"
                value={canteen?.email || ''}
                onChange={handleChange}
                fullWidth
                required
              />
            </Box>
            <Box mb={2}>
              <TextField
                label="About"
                name="about"
                multiline
                rows={3}
                value={canteen?.about || ''}
                onChange={handleChange}
                fullWidth
              />
            </Box>
            <Box mb={2}>
              <TextField
                label="Opening Hours"
                name="opening_hours"
                value={canteen?.opening_hours || ''}
                onChange={handleChange}
                fullWidth
                required
              />
            </Box>
            <Box mb={2}>
              <TextField
                label="Closing Hours"
                name="closing_hours"
                value={canteen?.closing_hours || ''}
                onChange={handleChange}
                fullWidth
                required
              />
            </Box>
            <Button disableElevation variant="contained" color="primary" type="submit">
              Save Changes
            </Button>
            <Button
              disableElevation
              sx={{ marginLeft: 2 }}
              variant="contained"
              color="inherit"
              onClick={() => navigate('/canteens')}
            >
              Cancel
            </Button>
          </form>
        </Box>
      </Container>
    </DashboardLayout>
  );
};

export { DashboardSettingPage };
