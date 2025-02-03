import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Collapse,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Restaurant as RestaurantIcon,
  ShoppingCart as ShoppingCartIcon,
  Settings as SettingsIcon,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import ProfileMenu from '../../components/molecules/ProfileMenu';

const drawerWidth = 240;

interface MenuItem {
  text: string;
  icon?: React.ReactNode;
  href: string;
  children?: MenuItem[];
}

interface MenuSection {
  label: string;
  items: MenuItem[];
}

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = (props) => {
  const [open, setOpen] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const menuSections: MenuSection[] = [
    {
      label: 'Overview',
      items: [{ text: 'Dashboard', icon: <DashboardIcon />, href: '/dashboard' }],
    },
    {
      label: 'Management',
      items: [
        { text: 'Ledger', icon: <RestaurantIcon />, href: '/dashboard/ledger' },
        { text: 'Orders', icon: <ShoppingCartIcon />, href: '/dashboard/orders' },
        {
          text: 'Menu',
          icon: <RestaurantIcon />,
          href: "",
          children: [
            { text: 'View Menu', href: '/dashboard/menu' },
            { text: 'Menu Items', href: '/dashboard/menu-detail' },
          ],
        },
      ],
    },
    {
      label: 'Misc',
      items: [{ text: 'Settings', icon: <SettingsIcon />, href: '/dashboard/settings' }],
    },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar color="default" position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer - 1 }}>
        <Toolbar sx={{ marginLeft: open ? '240px' : '0px' }}>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 0 }}>
            QuickCafe Dashboard
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          <ProfileMenu />
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          display: open ? 'block' : 'none',
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            color: '#b3b9c6',
            backgroundColor: '#121621',
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Box sx={{ overflow: 'auto' }}>
          <Box sx={{ padding: 2 }}>
            <Typography textAlign="center" variant="h5">
              QuickCafe
            </Typography>
            <Typography textAlign="center" variant="subtitle2">
              Scan. Order. Enjoy.
            </Typography>
          </Box>
          <List>
            {menuSections.map((section) => (
              <Box key={section.label}>
                <Typography sx={{ paddingLeft: 2, paddingTop: 1, color: '#b3b9c6' }} variant="caption">
                  {section.label}
                </Typography>
                {section.items.map((item) => (
                  item.children ? (
                    <Box key={item.text}>
                      <ListItemButton onClick={handleMenuToggle} selected={location.pathname.includes('/dashboard/menu')}>
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        {open && <ListItemText primary={item.text} />}
                        {menuOpen ? <ExpandLess /> : <ExpandMore />}
                      </ListItemButton>
                      <Collapse in={menuOpen} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                          {item.children.map((subItem) => (
                            <ListItemButton
                              key={subItem.text}
                              component={Link}
                              to={subItem.href}
                              selected={location.pathname === subItem.href}
                              sx={{ pl: 4 }}
                            >
                              <ListItemText primary={subItem.text} />
                            </ListItemButton>
                          ))}
                        </List>
                      </Collapse>
                    </Box>
                  ) : (
                    <ListItemButton
                      key={item.text}
                      component={Link}
                      to={item.href}
                      selected={location.pathname === item.href}
                    >
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      {open && <ListItemText primary={item.text} />}
                    </ListItemButton>
                  )
                ))}
              </Box>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ paddingTop: '64px', width: '100%' }}>{props.children}</Box>
    </Box>
  );
};

export default DashboardLayout;
