import React, { useState, ReactNode, useContext } from 'react';
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
  Badge,
  ListItemIcon,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SimpleBottomNavigation from '../molecules/BottomNavigation';
import { Link, NavigateFunction, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';
import { RoleService } from '../../utils/Utils';
import { Logout, Settings, ShoppingCartOutlined } from '@mui/icons-material';
import SearchBar from '../molecules/SearchBar';
import { CartContext } from '../../context/CartContext';
import HistoryIcon from '@mui/icons-material/History';
import HistoryToggleOffTwoToneIcon from '@mui/icons-material/HistoryToggleOffTwoTone';
import GridViewTwoToneIcon from '@mui/icons-material/GridViewTwoTone';
import ProfileMenu from '../molecules/ProfileMenu';

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
  const roleService = new RoleService();

  const cartContext = useContext(CartContext);

  if (!cartContext) {
    return null;
  }

  const { cart } = cartContext;

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
          <Box sx={{ display: 'flex', gap: '16px', flexGrow: 1, alignItems: 'center' }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
              <Typography variant="h6" component="div">
                QuickCafe
              </Typography>
            </Link>

            <SearchBar />
            <Box sx={{ flexGrow: 1 }} />
          </Box>

          <IconButton color="inherit" onClick={() => navigate('/cart')} sx={{ padding: '8px' }}>
            <Badge
              badgeContent={cart.reduce((acc, item) => acc + item.quantity, 0)}
              color="default"
              sx={{ '.MuiBadge-badge': { background: 'white', color: 'black' }, marginRight: '16px' }}
            >
              <ShoppingCartOutlined />
            </Badge>
          </IconButton>
          {/* Avatar with Menu */}
          <ProfileMenu/>
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
