import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Link } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { deepOrange } from '@mui/material/colors';

const RegisterPage: React.FC = () => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { register } = useAuth();

  const handleRegister = async () => {
    register(firstName, lastName, email, password);
  };

  return (
    <Box className="auth-wrapper">
      <Box className="container">
        <Box className="banner" sx={{ background: deepOrange[500] }}>
          <Box>
            <Typography variant="h4">QuickCafe</Typography>
            <Typography variant="h5">Scan. Order. Enjoy.</Typography>
          </Box>
        </Box>
        <Box className="form-wrapper">
          <Box sx={{ maxWidth: '620px' }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h5" component="h1">
                Get started absolutely free
              </Typography>
              <Typography>
                Already have an account?{' '}
                <Link href="/login" variant="body2" sx={{ mt: 2 }}>
                  Get started.
                </Link>
              </Typography>
            </Box>
            <TextField
              label="First Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <TextField
              label="Last Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleRegister}>
              Register
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export { RegisterPage };
