import React, { useState } from 'react';
import {
  AppBar,
  Avatar,
  Box,
  Card,
  CardContent,
  Drawer,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
  Paper,
  Badge,
  Divider
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

const drawerWidth = 240;

const DashboardPage = () => {
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [salesData] = useState([
    { name: 'Mon', sales: 2400 },
    { name: 'Tue', sales: 1398 },
    { name: 'Wed', sales: 9800 },
    { name: 'Thu', sales: 3908 },
    { name: 'Fri', sales: 4800 },
  ]);

  const [popularItems] = useState([
    { name: 'Pizza', orders: 145, revenue: 1450 },
    { name: 'Burger', orders: 120, revenue: 960 },
    { name: 'Salad', orders: 90, revenue: 630 },
    { name: 'Pasta', orders: 75, revenue: 675 },
  ]);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon /> },
    { text: 'Menu', icon: <RestaurantIcon /> },
    { text: 'Orders', icon: <ShoppingCartIcon /> },
    { text: 'Customers', icon: <PeopleIcon /> },
    { text: 'Analytics', icon: <BarChartIcon /> },
    { text: 'Settings', icon: <SettingsIcon /> },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      {/* App Bar */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
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
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search..."
            />
          </Paper>

          <Box sx={{ flexGrow: 1 }} />

          {/* Notification Icon */}
          <IconButton color="inherit">
            <Badge badgeContent={4} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* Profile Menu */}
          <IconButton
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <Avatar sx={{ width: 32, height: 32 }}>JD</Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
          >
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
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { 
            width: drawerWidth, 
            boxSizing: 'border-box',
            ...(!open && {
              width: theme => theme.spacing(7),
              overflowX: 'hidden'
            })
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {menuItems.map((item, index) => (
              <ListItem button key={item.text}>
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                {open && <ListItemText primary={item.text} />}
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {/* Stats Cards */}
        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          {[
            { title: 'Total Revenue', value: '$12,345', change: '+15%' },
            { title: 'Total Orders', value: '1,234', change: '+8%' },
            { title: 'Active Menu Items', value: '45', change: '+5' },
            { title: 'Total Customers', value: '892', change: '+12%' },
          ].map((stat, index) => (
            <Card key={index} sx={{ minWidth: 240 }}>
              <CardContent>
                <Typography variant="h6" component="div">
                  {stat.title}
                </Typography>
                <Typography variant="h4" component="div">
                  {stat.value}
                </Typography>
                <Typography sx={{ color: 'success.main' }}>
                  {stat.change} from last month
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>

        {/* Charts and Tables */}
        <Stack direction="row" spacing={2}>
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Weekly Sales
              </Typography>
              <Box sx={{ height: 300 }}>
                {/* Bar Chart visualization would go here */}
                <Box sx={{ display: 'flex', height: '100%', alignItems: 'flex-end' }}>
                  {salesData.map((item) => (
                    <Box
                      key={item.name}
                      sx={{
                        flex: 1,
                        mx: 0.5,
                        bgcolor: 'primary.main',
                        height: `${(item.sales / 10000) * 100}%`,
                        borderRadius: '4px 4px 0 0',
                        position: 'relative',
                      }}
                    >
                      <Typography variant="caption" sx={{ position: 'absolute', bottom: -20, width: '100%', textAlign: 'center' }}>
                        {item.name}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Popular Items
              </Typography>
              <Stack spacing={2}>
                {popularItems.map((item) => (
                  <Box key={item.name} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="subtitle1">{item.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.orders} orders
                      </Typography>
                    </Box>
                    <Box textAlign="right">
                      <Typography variant="subtitle1">${item.revenue}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        revenue
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Box>
    </Box>
  );
};

export {DashboardPage};