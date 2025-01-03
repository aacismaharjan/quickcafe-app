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
    <Card sx={{ position: 'relative', overflow: 'hidden', borderRadius: 2, maxHeight: '240px' }}>
      <CardMedia
        component="img"
        height="200"
        image={`${API_SERVER}/${canteen.image_url}`}
        alt={canteen.name}
        sx={{ filter: 'brightness(0.7)' }} // Darken the image for better text visibility
      />
      <CardContent
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          color: 'white',
          padding: 2,
          // backgroundColor: alpha(theme.palette.primary.dark, 0.7),
          // @ts-expect-error no matter
          backgroundColor: alpha(theme.palette.primary.dark, 0.9),
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
