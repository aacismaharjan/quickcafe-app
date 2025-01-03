/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import axiosInstance from '../utils/AxiosInstance';
import { toast } from 'react-toastify';
import { useLoading } from '../context/LoadingContext';

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const { loading, setLoading } = useLoading();

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/profile');
        setProfile(response.data); // Assuming the response is an array
      } catch (err) {
        console.log('Failed to fetch profile data.' + err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle input change
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setProfile((prevProfile: any) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    const tempProfile = profile;
    delete tempProfile['authorities'];
    event.preventDefault();
    try {
      setLoading(true);
      await axiosInstance.put('/profile', profile); // Update profile
      toast.info('Profile updated successfully!');
    } catch (err) {
      console.log(err);
      toast.error('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <></>;

  return (
    <React.Fragment>
      <Box sx={{ padding: 2 }}>
        <Typography variant="h4" gutterBottom>
          Profile Settings
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box mb={2}>
            <TextField
              label="First Name"
              name="firstName"
              value={profile?.firstName}
              onChange={handleChange}
              fullWidth
              required
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="Last Name"
              name="lastName"
              value={profile?.lastName}
              onChange={handleChange}
              fullWidth
              required
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="Username"
              name="username"
              value={profile?.username}
              onChange={handleChange}
              fullWidth
              required
            />
          </Box>
          <Button variant="contained" color="primary" type="submit">
            Save Changes
          </Button>
        </form>
      </Box>
    </React.Fragment>
  );
};

export { ProfilePage };
