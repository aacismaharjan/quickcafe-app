import React from 'react';
import { Card, CardMedia, CardContent, Typography, Box, alpha } from '@mui/material';
import { Phone, LocationOn } from '@mui/icons-material';
import { useTheme } from '@emotion/react';
import { API_SERVER } from '../../utils/AxiosInstance';

interface CanteenBannerProps {
  canteen: {
    name: string;
    image_url: string;
    address: string;
    phone_no: string;
    about: string;
    opening_hours: string;
    closing_hours: string;
  };
}

const CanteenBanner: React.FC<CanteenBannerProps> = ({ canteen }) => {
  const theme = useTheme(); // Access the theme

  return (
    <Card sx={{ position: 'relative',  borderRadius: 2, height:"auto" }}>
      <CardContent
        sx={{
          color: 'white',
          padding: 2,
          // backgroundColor: alpha(theme.palette.primary.dark, 0.7),
          // @ts-expect-error no matter
          backgroundColor: alpha(theme.palette.primary.dark, 0.9),
          "&::before": {
            "content": "''",
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,
            backgroundImage: `url("${API_SERVER}/${canteen.image_url}")`
          }
        }}
      >
        <Typography variant="h4" component="div" gutterBottom>
          {canteen.name}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {canteen.about}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
          <Phone sx={{ marginRight: 1 }} />
          <Typography variant="body2">{canteen.phone_no}</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <LocationOn sx={{ marginRight: 1 }} />
          <Typography variant="body2">{canteen.address}</Typography>
        </Box>
        <Typography variant="body2" sx={{ marginTop: 2 }}>
          Opening Hours: {canteen.opening_hours} - {canteen.closing_hours}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CanteenBanner;
