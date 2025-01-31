import React, { useState } from 'react';
import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import DashboardLayout from './DashboardLayout';

const DashboardPage = () => {
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

  return (
    <DashboardLayout>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography>Dashboard</Typography>
      </Box>
    </DashboardLayout>
  );
};

export { DashboardPage };
