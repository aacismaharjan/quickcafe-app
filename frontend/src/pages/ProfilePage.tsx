/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { TextField, Button, Typography, Box, Container, Paper } from '@mui/material';
import axiosInstance from '../utils/AxiosInstance';
import { toast } from 'react-toastify';
import { useLoading } from '../context/LoadingContext';
import { useNavigate } from 'react-router-dom';
import FileUploadButtonWithInfo from '../components/molecules/FileUploadButton';
import { useAuth } from '../hooks/useAuth';

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const navigate = useNavigate();
  const { loading, setLoading } = useLoading();
  const { changeUser } = useAuth();

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

  // Handle password change input
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setPasswordData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const tempProfile = { ...profile };
      delete tempProfile['authorities'];

      const formData = new FormData();
      formData.append(
        'profileJson',
        JSON.stringify({
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
        })
      );

      if (imageFile) {
        formData.append('image_url', imageFile);
      }

      const res = await axiosInstance.patch('/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      changeUser(res.data);

      toast.info('Profile updated successfully!');
    } catch (err) {
      console.log(err);
      toast.error('Failed to update profile.');
    }
  };

  // Handle password change form submission
  const handlePasswordSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New password and confirmation do not match.');
      return;
    }
    try {
      const res = await axiosInstance.post('/auth/change-password', passwordData); // Update password
      toast.info(res.data.message);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      // Type the error as AxiosError to get better type inference
      if (err?.response?.data?.message) {
        toast.warn(err.response.data.message);
      } else {
        toast.error('An unexpected error occurred.');
      }
    }
  };

  const handleFileChange = (file: File) => {
    setImageFile(file);
  };

  if (loading) return <></>;

  return (
    <React.Fragment>
      <Container maxWidth="md" disableGutters>
        <Box sx={{ padding: 2 }}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h5" gutterBottom sx={{ paddingBottom: 1 }}>
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

              <Box mb={2}>
                <FileUploadButtonWithInfo label="Photo" onFileChange={handleFileChange} />
              </Box>
              <Button disableElevation variant="contained" color="primary" type="submit">
                Save Changes
              </Button>
              <Button
                disableElevation
                sx={{ marginLeft: 2 }}
                variant="contained"
                color="inherit"
                onClick={() => navigate('/account')}
              >
                Cancel
              </Button>
            </form>

            {/* Password Change Section */}
            <Typography variant="h6" gutterBottom sx={{ paddingTop: 3 }}>
              Change Password
            </Typography>
            <form onSubmit={handlePasswordSubmit}>
              <Box mb={2}>
                <TextField
                  label="Old Password"
                  name="oldPassword"
                  type="password"
                  value={passwordData.oldPassword}
                  onChange={handlePasswordChange}
                  fullWidth
                  required
                />
              </Box>
              <Box mb={2}>
                <TextField
                  label="New Password"
                  name="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  fullWidth
                  required
                />
              </Box>
              <Box mb={2}>
                <TextField
                  label="Confirm New Password"
                  name="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  fullWidth
                  required
                />
              </Box>
              <Button disableElevation variant="contained" color="secondary" type="submit">
                Change Password
              </Button>
            </form>
          </Paper>
        </Box>
      </Container>
    </React.Fragment>
  );
};

export { ProfilePage };
