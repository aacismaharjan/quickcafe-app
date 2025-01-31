import React, { useState, useContext } from 'react';
import {
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { RoleService } from '../../utils/Utils';
import { Logout, Settings } from '@mui/icons-material';
import { CartContext } from '../../context/CartContext';
import HistoryIcon from '@mui/icons-material/History';
import GridViewTwoToneIcon from '@mui/icons-material/GridViewTwoTone';
import { handleLogout } from '../template/AppLayout';


const ProfileMenu: React.FC = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);
  const { user } = useAuth();
  const roleService = new RoleService();

  const cartContext = useContext(CartContext);

  if (!cartContext) {
    return null;
  }


  // Handle menu open/close
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton onClick={handleMenuClick}>
        <Avatar alt="User Avatar">{user?.firstName.charAt(0)}</Avatar>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleMenuClose}
        // anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        anchorReference="anchorPosition"
        anchorPosition={anchorEl ? { top: anchorEl.getBoundingClientRect().bottom - 8, left: anchorEl.getBoundingClientRect().right  - 8 } : undefined}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{
          /*'.MuiPaper-root': { top: '51px !important', left: '1214px !important' },*/ '.MuiList-root': {
            minWidth: '180px',
          },
        }}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
      >
        <MenuItem
          onClick={() => {
            handleMenuClose();
            navigate('/profile');
          }}
        >
          <Avatar />
          Profile
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            navigate('/my-order-history');
          }}
        >
          <ListItemIcon>
            <HistoryIcon fontSize="small" />
          </ListItemIcon>
          My Order History
        </MenuItem>

        {roleService.hasRole('ROLE_ADMIN') && (
          <MenuItem
            onClick={() => {
              handleMenuClose();
              navigate('/dashboard');
            }}
          >
            <ListItemIcon>
              <GridViewTwoToneIcon fontSize="small" />
            </ListItemIcon>
            Go to Dashboard
          </MenuItem>
        )}
        <Divider />
        <MenuItem
          onClick={() => {
            handleMenuClose();
            navigate('/account');
          }}
        >
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            handleLogout(navigate);
          }}
        >
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </div>
  );
};

export default ProfileMenu;
