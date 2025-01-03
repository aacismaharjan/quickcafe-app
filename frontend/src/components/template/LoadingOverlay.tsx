import React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import logo from '/vite.svg';
import { useLoading } from '../../context/LoadingContext';

const LoadingOverlay: React.FC = () => {
  const { loading } = useLoading();

  console.log('Loading', loading);

  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        background: '#FFF',
      }}
      open={loading}
    >
      <Box component="img" src={logo} alt="Logo" sx={{ width: 80, height: 80 }} />
    </Backdrop>
  );
};

export default LoadingOverlay;
