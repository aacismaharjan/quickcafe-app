import React, { useState, useContext, useEffect } from 'react';
import { IconButton, Avatar, Menu, MenuItem, ListItemIcon, Divider, Typography, Box,  } from '@mui/material';
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
  const [imageUrl, setImageUrl] = useState("");
  const { user } = useAuth();
  const roleService = new RoleService();

  const cartContext = useContext(CartContext);

  

  // Handle menu open/close
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(()=> {
    console.log("USE EFFECT", user);
    setImageUrl(`http://localhost:8080/${user?.image_url}`)
  }, [user])

  if (!cartContext) {
    return null;
  }


  return (
    <div>
      <IconButton onClick={handleMenuClick}>
        <Avatar
          alt="User Avatar"
          // src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6SBFO_34s3mUw1zz2SuAVXn83OArtd8D9GQ&s"
          src={imageUrl}
        >
          {user?.firstName.charAt(0)}
        </Avatar>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleMenuClose}
        // anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        anchorReference="anchorPosition"
        anchorPosition={
          anchorEl
            ? { top: anchorEl.getBoundingClientRect().bottom - 8, left: anchorEl.getBoundingClientRect().right - 8 }
            : undefined
        }
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{
          /*'.MuiPaper-root': { top: '51px !important', left: '1214px !important' },*/ '.MuiList-root': {
            minWidth: '220px',
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
          <Box>
            <Box sx={{display: "flex", gap: "4px"}}>
              <Avatar
                sx={{ '&.MuiAvatar-root': { width: '45px', height: '45px' } }}
                src={imageUrl}
              />
              <Box>
                <Typography variant="subtitle1" sx={{ lineHeight: '1.4' }}>
                  {user?.firstName} {user?.lastName}
                </Typography>
                <Typography variant="subtitle2">
                  {/* {user?.email && user?.email.length > 20 ? `${user?.email.substring(0, 17)}...` : user?.email} */}
                  {/* {user?.roles && user.roles.map(role => <Chip label={role.name.substring(5)}  size="small" sx={{marginRight: 0.5}}/>)} */}
                  {user?.email && user.email.length > 25 ? (() => {
    const [name, domain] = user.email.split("@");
    const maxNameLength = 25 - (domain.length + 5); // 5 = "[txt]@"
    
    return `${name.substring(0, maxNameLength)}***@${domain}`;
  })() : user?.email}
                </Typography>
              </Box>
            </Box>
          </Box>
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
