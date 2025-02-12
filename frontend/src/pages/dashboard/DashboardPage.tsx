import { Card, CardContent, Typography, Grid, Box, TextField, FormControl } from '@mui/material';
import { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title, CategoryScale, BarElement, LinearScale } from 'chart.js';
import { API_SERVER } from '../../utils/AxiosInstance';
import { useOwnerCanteenID } from './utils/useOwnerCanteenID';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, Title, CategoryScale);
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DashboardPage = () => {
  const [orderStats, setOrderStats] = useState<any>({});
  const [year, setYear] = useState(2025); // Default year
  const {ownerCanteenID} = useOwnerCanteenID();
  const [data, setData] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    totalRevenue: 0,
    pendingPayment: 0,
    paidAmount: 0,
    failedAmount: 0,
  });

  // Fetch data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${API_SERVER}/api/v1/canteens/${ownerCanteenID}/orders/stats`); // Replace with your API URL
      const result = await response.json();
      setData(result);
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Fetch monthly order status distribution for the selected year
    fetch(`${API_SERVER}/api/v1/canteens/${ownerCanteenID}/orders/monthly-status-distribution?year=${year}`)
      .then((response) => response.json())
      .then((data) => setOrderStats(data))
      .catch((error) => console.error('Error fetching order stats:', error));
  }, [year]);

  // Handle year change
  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  // Prepare the chart data
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Prepare the data for the Stacked Bar Chart (Group data by month)
  const data2 = {
    labels: months,
    datasets: [
      {
        label: 'Received Orders',
        data: months.map((_, index) => (orderStats.RECEIVED && orderStats.RECEIVED[index + 1] ? orderStats.RECEIVED[index + 1] : 0)),
        backgroundColor: '#28a745',  // Green
        borderColor: '#28a745',
        borderWidth: 1,
      },
      {
        label: 'In Progress Orders',
        data: months.map((_, index) => (orderStats.IN_PROGRESS && orderStats.IN_PROGRESS[index + 1] ? orderStats.IN_PROGRESS[index + 1] : 0)),
        backgroundColor: '#007bff',  // Blue
        borderColor: '#007bff',
        borderWidth: 1,
      },
      {
        label: 'Completed Orders',
        data: months.map((_, index) => (orderStats.COMPLETED && orderStats.COMPLETED[index + 1] ? orderStats.COMPLETED[index + 1] : 0)),
        backgroundColor: '#17a2b8',  // Light Green (More neutral than dark green)
        borderColor: '#17a2b8',
        borderWidth: 1,
      },
      {
        label: 'Canceled Orders',
        data: months.map((_, index) => (orderStats.CANCELED && orderStats.CANCELED[index + 1] ? orderStats.CANCELED[index + 1] : 0)),
        backgroundColor: '#dc3545',  // Red
        borderColor: '#dc3545',
        borderWidth: 1,
      },
    ],
  };
  

  // Pie Chart Data for Revenue Distribution
  const pieChartData = {
    labels: ['Paid Amount', 'Pending Payment', 'Failed Payment'],
    datasets: [
      {
        data: [data.paidAmount, data.pendingPayment, data.failedAmount],
        backgroundColor: ['#4caf50', '#ff9800', '#ff0000'],
        borderColor: ['#4caf50', '#ff9800', '#ff0000'],
        borderWidth: 1,
      },
    ],
  };

  // Pie Chart Options
  const pieChartOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: Rs. ${value}`;
          },
        },
      },
    },
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        {/* Total Orders Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#3f51b5', color: '#fff' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Orders
              </Typography>
              <Typography variant="h4">{data.totalOrders}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Pending Orders Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#ff9800', color: '#fff' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Pending Orders
              </Typography>
              <Typography variant="h4">{data.pendingOrders}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Completed Orders Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#4caf50', color: '#fff' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Completed Orders
              </Typography>
              <Typography variant="h4">{data.completedOrders}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Cancelled Orders Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#f44336', color: '#fff' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Cancelled Orders
              </Typography>
              <Typography variant="h4">{data.cancelledOrders}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <br />
      <Grid container spacing={3}>
        {/* Pie Chart for Revenue Distribution */}
        <Grid item xs={6} sm={3} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Revenue Distribution
              </Typography>
              <Pie data={pieChartData} options={pieChartOptions} />
            </CardContent>
          </Card>
        </Grid>

        {/* Stacked Bar Chart for Monthly Order Status Distribution */}
        <Grid item xs={12} sm={12} md={9}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Monthly Order Status Distribution
              </Typography>

              <FormControl>
                <TextField
                  type="number"
                  id="year"
                  size="small"
                  value={year}
                  variant="outlined"
                  placeholder="Year:"
                  onChange={handleYearChange}
                  InputProps={{
                    inputProps: {
                      min: 2020,
                      max: new Date().getFullYear(),
                    },
                  }}
                />
              </FormControl>

              <Bar
                data={data2}
                options={{
                  responsive: true,
                  interaction: {
                    intersect: true
                  },
                  scales: {
                    x: {
                      stacked: true, // Stack bars for each month
                    },
                    y: {
                      stacked: true,
                    },
                  },
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                  },
                }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export { DashboardPage };
