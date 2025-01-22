import React, { useState } from 'react';
import {
  AppBar,
  Avatar,
  Box,
  Drawer,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  Paper,
  Badge,
  Button,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Dashboard as DashboardIcon,
  Restaurant as RestaurantIcon,
  ShoppingCart as ShoppingCartIcon,
  People as PeopleIcon,
  BarChart as BarChartIcon,
  Settings as SettingsIcon,
  ChevronLeft as ChevronLeftIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const drawerWidth = 240;

const DashboardLayout = (props: React.PropsWithChildren) => {
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, href: "/dashboard" },
    { text: 'Ledger', icon: <RestaurantIcon />, href:"/dashboard/ledger" },
    { text: 'Menu', icon: <RestaurantIcon />, href:"/dashboard/menu" },
    { text: 'Menu Items', icon: <RestaurantIcon />, href:"/dashboard/menu-detail" },
    { text: 'Orders', icon: <ShoppingCartIcon />, href: "/dashboard/orders" },
    { text: 'Settings', icon: <SettingsIcon />, href: "/dashboard/settings" },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      {/* App Bar */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
            {/* {open ? <ChevronLeftIcon /> : <MenuIcon />} */}
            <MenuIcon/>
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 0 }}>
            Canteen Dashboard
          </Typography>

          {/* Search Bar */}
          <Paper
            component="form"
            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400, ml: 4, mr: 2 }}
          >
            <IconButton sx={{ p: '10px' }}>
              <SearchIcon />
            </IconButton>
            <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Search..." />
          </Paper>

          <Box sx={{ flexGrow: 1 }} />

          {/* Notification Icon */}
          <IconButton color="inherit">
            <Badge badgeContent={4} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* Profile Menu */}
          <IconButton onClick={handleProfileMenuOpen} color="inherit">
            <Avatar sx={{ width: 32, height: 32 }}>JD</Avatar>
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleProfileMenuClose}>
            <MenuItem>Profile</MenuItem>
            <MenuItem>Settings</MenuItem>
            <MenuItem>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: drawerWidth,
          ...(!open && {
            width: (theme) => theme.spacing(7),
            overflowX: 'hidden',
          }),
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            ...(!open && {
              width: (theme) => theme.spacing(7),
              overflowX: 'hidden',
            }),
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {menuItems.map((item) => (
              <ListItem  key={item.text} component={Link} to={item.href}>
                <ListItemIcon sx={{
                  minWidth: open ? "56px" : "auto",
                }}>{item.icon}</ListItemIcon>
                {open && <ListItemText primary={item.text} />}
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ paddingTop: "64px", width: "100%" }}>{props.children}</Box>
    </Box>
  );
};

export default DashboardLayout;
