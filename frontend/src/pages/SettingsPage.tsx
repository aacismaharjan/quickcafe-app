import React from 'react';
import { Box, Typography, Divider, List, ListItem, ListItemText, Button, Paper, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { handleLogout } from '../components/template/AppLayout';

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    // Logic for navigation (e.g., using react-router to navigate)
    console.log(`Navigating to ${path}`);
    navigate(path);
  };

  return (
    <React.Fragment>
      <Container maxWidth="md" sx={{ p: 3, maxWidth: 600, margin: 'auto' }}>
       <Paper sx={{padding: 2}}>
       <Typography variant="h5" sx={{ mb: 2 }}>
          Settings
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <List>
          <ListItem onClick={() => handleNavigate('/profile')} component={Button}>
            <ListItemText primary="Profile Settings" />
          </ListItem>
          <ListItem onClick={() => handleNavigate('/my-order-history')}  component={Button}>
            <ListItemText primary="My Order History" />
          </ListItem>
          <Divider sx={{ my: 2 }} />
          <ListItem
           component={Button}
            onClick={() => {
              handleLogout(navigate);
            }}
          >
            <ListItemText primary="Logout" sx={{ color: 'error.main' }} />
          </ListItem>
        </List>

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body2" color="text.secondary">
            &copy; {new Date().getFullYear()} QuickCafe. All rights reserved.
          </Typography>
        </Box>
       </Paper>
      </Container>
    </React.Fragment>
  );
};

export { SettingsPage };
