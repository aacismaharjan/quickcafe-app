import React, {  ReactNode, useContext } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Badge,
} from '@mui/material';
import SimpleBottomNavigation from '../molecules/BottomNavigation';
import { Link, NavigateFunction, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {  ShoppingCartOutlined } from '@mui/icons-material';
import SearchBar from '../molecules/SearchBar';
import { CartContext } from '../../context/CartContext';
import ProfileMenu from '../molecules/ProfileMenu';
import SyncAltIcon from '@mui/icons-material/SyncAlt';

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
  const cartContext = useContext(CartContext);

  if (!cartContext) {
    return null;
  }

  const { cart } = cartContext;

  const handleOpenCanteenMap = () => {
    navigate('/map');
  }


  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* AppBar */}
      <AppBar position="fixed">
        <Toolbar>
          {/* Hamburger Menu Icon */}
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleOpenCanteenMap} sx={{ mr: 2 }}>
            <SyncAltIcon />
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

          <IconButton color="inherit" onClick={() => navigate('/cart')} sx={{ padding: '8px' , marginRight: '16px'}}>
            <Badge
              badgeContent={cart.reduce((acc, item) => acc + item.quantity, 0)}
              color="default"
              sx={{ '.MuiBadge-badge': { background: 'white', color: 'black' }, }}
            >
              <ShoppingCartOutlined />
            </Badge>
          </IconButton>

          {/* Avatar with Menu */}
          <ProfileMenu/>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box component="main" sx={{ paddingTop: '64px', paddingBottom: '56px' }}>
        {children}
      </Box>
      <SimpleBottomNavigation />
    </Box>
  );
};

export default AppLayout;
