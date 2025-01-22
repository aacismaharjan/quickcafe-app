import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
} from '@mui/material';
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
      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
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
    </DashboardLayout>
  );
};

export {DashboardPage};