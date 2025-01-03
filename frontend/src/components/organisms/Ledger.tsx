import React from 'react';
import { Box, Typography } from '@mui/material';

interface LedgerProps {
  ledger: {
    name: string;
    description: string;
  };
}

const Ledger: React.FC<LedgerProps> = ({ ledger }) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        {ledger.name}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {ledger.description}
      </Typography>
    </Box>
  );
};

export default Ledger;
