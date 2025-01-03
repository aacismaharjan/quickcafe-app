import React, { useState, ReactNode } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Box,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SimpleBottomNavigation from '../molecules/BottomNavigation';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';

interface AppLayoutProps {
  children: ReactNode;
}

export const handleLogout = (navigate: NavigateFunction) => {
  localStorage.clear();
  toast.success('Successfully logout from the session.');
  navigate('/login');
};

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);
  const { user } = useAuth();

  // Toggle the drawer
  const toggleDrawer = (open: boolean) => {
    setDrawerOpen(open);
  };

  // Handle menu open/close
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* AppBar */}
      <AppBar position="fixed">
        <Toolbar>
          {/* Hamburger Menu Icon */}
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => toggleDrawer(true)} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          {/* Logo */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            QuickCafe
          </Typography>
          {/* Avatar with Menu */}
          <IconButton onClick={handleMenuClick}>
            <Avatar alt="User Avatar">{user?.firstName.charAt(0)}</Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={isMenuOpen}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem
              onClick={() => {
                handleMenuClose();
                navigate('/profile');
              }}
            >
              Profile
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleMenuClose();
                navigate('/account');
              }}
            >
              Settings
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleMenuClose();
                navigate('/my-order-history');
              }}
            >
              My Order History
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleMenuClose();
                handleLogout(navigate);
              }}
            >
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer anchor="left" open={drawerOpen} onClose={() => toggleDrawer(false)}>
        <List sx={{ width: 250 }}>
          <ListItem onClick={() => toggleDrawer(false)}>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem onClick={() => toggleDrawer(false)}>
            <ListItemText primary="Menu" />
          </ListItem>
          <ListItem onClick={() => toggleDrawer(false)}>
            <ListItemText primary="Orders" />
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ paddingTop: '64px', paddingBottom: '56px' }}>
        {children}
      </Box>
      <SimpleBottomNavigation />
    </Box>
  );
};

export default AppLayout;
