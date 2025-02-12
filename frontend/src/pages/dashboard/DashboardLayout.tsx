import React, { useEffect, useState } from 'react';
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
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ProfileMenu from '../../components/molecules/ProfileMenu';
import StarsOutlinedIcon from '@mui/icons-material/StarsOutlined';
import { handleLogout } from '../../components/template/AppLayout';
import { toast } from 'react-toastify';
import { useLoading } from '../../context/LoadingContext';
import axiosInstance from '../../utils/AxiosInstance';
import { AxiosError } from 'axios';

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

  const navigate = useNavigate();
  const { setLoading } = useLoading();
  const [ownerCanteen, setOwnerCanteen] = useState<CanteenTypeI>();

  const handleDrawerToggle = () => setOpen(!open);
  const handleMenuToggle = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    const fetchMyCanteen = async () => {
      setLoading(true);
      await axiosInstance('/profile/canteen')
        .then((res) => {
          const canteen = res.data;
          localStorage.setItem('ownerCanteenID', JSON.stringify(canteen.id));
          localStorage.setItem('ownerCanteen', JSON.stringify(canteen));
          setOwnerCanteen(canteen);
        })
        .catch((err: AxiosError<{ message: string }>) => {
          if (err.response) toast.warn(err.response.data?.message);
          else toast.warn('Something went wrong.');
          handleLogout(navigate);
        });
      setLoading(false);
    };
    fetchMyCanteen();
  }, []);

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
          href: '',
          children: [
            { text: 'View Menu', href: '/dashboard/menu' },
            { text: 'Menu Items', href: '/dashboard/menu-detail' },
          ],
        },
        { text: 'Reviews', icon: <StarsOutlinedIcon />, href: '/dashboard/reviews' },
      ],
    },
    {
      label: 'Misc',
      items: [{ text: 'Settings', icon: <SettingsIcon />, href: '/dashboard/settings' }],
    },
  ];

  if (ownerCanteen == null) {
    return <></>;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        color="default"
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: '#1E293B', // Dark Blue Shade
          color: '#FFFFFF', // White Text
          width: `calc(100% - ${open ? drawerWidth : 0}px)`,
          marginLeft: `${open ? drawerWidth : 0}px`,
        }}
      >
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            QuickCafe Dashboard
          </Typography>

          <Box sx={{ flexGrow: 1 }} />
          <ProfileMenu />
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: open ? drawerWidth : 0,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: open ? drawerWidth : 0,
            backgroundColor: '#121621',
            color: '#FFFFFF',
            boxShadow: '3px 0px 5px rgba(0,0,0,0.2)',
          },
        }}
      >
        <Box sx={{ overflow: 'auto', paddingY: 2 }}>
          <Box sx={{ marginTop: 0 }}>
            <Box sx={{ transform: 'scale(0.75)' }}>
              <Typography textAlign="center" variant="h6" color="gray">
                QuickCafe
              </Typography>
              <Typography textAlign="center" variant="subtitle2" color="gray">
                Scan. Order. Enjoy.
              </Typography>
            </Box>
          </Box>

          <Typography textAlign="center" variant="h6" sx={{ marginTop: 0, marginBottom: 1 }} component={'h3'}>
            {ownerCanteen?.name}
          </Typography>

          <List sx={{ paddingTop: 2 }}>
            {menuSections.map((section) => (
              <Box key={section.label} sx={{ px: 2 }}>
                <Typography sx={{ paddingY: 1, fontSize: '0.85rem', color: 'gray' }}>{section.label}</Typography>

                {section.items.map((item) =>
                  item.children ? (
                    <Box key={item.text}>
                      <ListItemButton
                        onClick={handleMenuToggle}
                        selected={location.pathname.includes('/dashboard/menu')}
                        sx={{
                          borderRadius: 2,
                          '&.Mui-selected': { backgroundColor: '#334155' },
                          '&:hover': { backgroundColor: '#1E293B' },
                          marginBottom: '4px !important',
                        }}
                      >
                        <ListItemIcon sx={{ color: (theme) => theme.palette.primary.main }}>{item.icon}</ListItemIcon>
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
                              sx={{
                                pl: 4,
                                borderRadius: 2,
                                '&.Mui-selected': { backgroundColor: '#475569' },
                                '&:hover': { backgroundColor: '#1E293B' },
                              }}
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
                      sx={{
                        borderRadius: 2,
                        '&.Mui-selected': { backgroundColor: '#334155' },
                        '&:hover': { backgroundColor: '#1E293B' },
                      }}
                    >
                      <ListItemIcon sx={{ color: (theme) => theme.palette.primary.main }}>{item.icon}</ListItemIcon>
                      {open && <ListItemText primary={item.text} />}
                    </ListItemButton>
                  )
                )}
              </Box>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, paddingTop: '64px', backgroundColor: '#F1F5F9', minHeight: '100vh' }}>
        {props.children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;
