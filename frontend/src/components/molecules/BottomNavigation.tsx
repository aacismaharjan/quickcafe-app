import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { AccountBox, Home, ShoppingBag } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

export default function SimpleBottomNavigation() {
  const [value, setValue] = React.useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    // Map the current pathname to the index of the BottomNavigation
    switch (location.pathname) {
      case '/':
        setValue(0);
        break;
      case '/favorites':
        setValue(1);
        break;
      case '/cart':
        setValue(2);
        break;
      case '/account':
        setValue(3);
        break;
      default:
        setValue(0); // Default to Home if no match
    }
  }, [location.pathname]);

  return (
    <Box sx={{ width: '100%', position: 'fixed', zIndex: 99, bottom: 0, left: 0 }}>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(_, newValue) => {
          setValue(newValue);
          // Navigate based on the new value
          switch (newValue) {
            case 0:
              navigate('/');
              break;
            case 1:
              navigate('/favorites');
              break;
            case 2:
              navigate('/cart');
              break;
            case 3:
              navigate('/account');
              break;
            default:
              navigate('/');
          }
        }}
      >
        <BottomNavigationAction label="Home" icon={<Home />} />
        <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
        <BottomNavigationAction label="Cart" icon={<ShoppingBag />} />
        <BottomNavigationAction label="Account" icon={<AccountBox />} />
      </BottomNavigation>
    </Box>
  );
}
