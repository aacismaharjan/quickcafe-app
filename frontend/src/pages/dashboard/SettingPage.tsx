import React, { useEffect, useState } from 'react';
import { TextField, Button, Typography, Box, Container, Paper, Divider } from '@mui/material';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/AxiosInstance';
import FileUploadButtonWithInfo from '../../components/molecules/FileUploadButton';

const DashboardSettingPage: React.FC = () => {
  const [canteen, setCanteen] = useState<any>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCanteen = async () => {
      try {
        const response = await axiosInstance.get('/canteens/3');
        setCanteen(response.data);
      } catch (err) {
        console.log('Failed to fetch canteen data.', err);
      }
    };

    fetchCanteen();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCanteen((prevCanteen: any) => ({
      ...prevCanteen,
      [name]: value,
    }));
  };

  const handleFileChange = (file: File) => {
    setImageFile(file);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("canteenJson", JSON.stringify({
        name: canteen.name,
        about: canteen.about,
        phone_no: canteen.phone_no,
        email: canteen.email,
        address: canteen.address,
        closing_hours: canteen.closing_hours,
        opening_hours: canteen.opening_hours,
      }))
      
      if (imageFile) {
        formData.append('image_url', imageFile);
      }

      const response = await axiosInstance.patch(`/canteens/${canteen.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setCanteen(response.data);
      toast.info('Canteen details updated successfully!');
    } catch (err) {
      console.log(err);
      toast.error('Failed to update canteen details.');
    } finally {
      navigate('/dashboard');
    }
  };

  return (
    <Container maxWidth="xl" disableGutters>
      <Box sx={{ padding: 3 }}>
        <Paper sx={{ padding: 2 }}>
          <Typography variant="h5" gutterBottom sx={{ paddingBottom: 1 }}>
            Canteen Settings
          </Typography>
          <form onSubmit={handleSubmit}>
            {/* Basic Information */}
            <Typography variant="h6" sx={{ marginBottom: 2 }}>Basic Information</Typography>
            <Box mb={2}>
              <TextField label="Canteen Name" name="name" value={canteen?.name || ''} onChange={handleChange} fullWidth required />
            </Box>
            <Box mb={2}>
              <TextField label="About" name="about" multiline rows={3} value={canteen?.about || ''} onChange={handleChange} fullWidth />
            </Box>
            <Divider sx={{ my: 2 }} />

            {/* Media */}
            <Typography variant="h6" sx={{ marginBottom: 2 }}>Media</Typography>
            <Box mb={2}>
              <FileUploadButtonWithInfo label="Upload product photo" onFileChange={handleFileChange} />
            </Box>
            <Divider sx={{ my: 2 }} />

            {/* Contact Details */}
            <Typography variant="h6" sx={{ marginBottom: 2 }}>Contact Details</Typography>
            <Box mb={2}>
              <TextField label="Phone Number" name="phone_no" value={canteen?.phone_no || ''} onChange={handleChange} fullWidth required />
            </Box>
            <Box mb={2}>
              <TextField label="Email" name="email" type="email" value={canteen?.email || ''} onChange={handleChange} fullWidth required />
            </Box>
            <Box mb={2}>
              <TextField label="Address" name="address" value={canteen?.address || ''} onChange={handleChange} fullWidth required />
            </Box>
            <Divider sx={{ my: 2 }} />

            {/* Operating Hours */}
            <Typography variant="h6" sx={{ marginBottom: 2 }}>Operating Hours</Typography>
            <Box mb={2}>
              <TextField label="Opening Hours" name="opening_hours" value={canteen?.opening_hours || ''} onChange={handleChange} fullWidth required />
            </Box>
            <Box mb={2}>
              <TextField label="Closing Hours" name="closing_hours" value={canteen?.closing_hours || ''} onChange={handleChange} fullWidth required />
            </Box>
            <Button disableElevation variant="contained" color="primary" type="submit">
              Save Changes
            </Button>
            <Button disableElevation sx={{ marginLeft: 2 }} variant="contained" color="inherit" onClick={() => navigate('/dashboard')}>
              Cancel
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export { DashboardSettingPage };
