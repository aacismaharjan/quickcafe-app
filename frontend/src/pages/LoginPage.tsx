import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Link } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { deepOrange } from '@mui/material/colors';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();
  const { login, user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async () => {
    await login(email, password);
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
                Sign in to your account
              </Typography>
              <Typography>
                Don't have account?{' '}
                <Link component={RouterLink} to="/register" variant="body2" sx={{ mt: 2 }}>
                  Get started.
                </Link>
              </Typography>
            </Box>
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
            <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleSubmit}>
              Submit
            </Button>
            <Link component={RouterLink} to="/reset-password" sx={{textDecoration: "none", display: "inline-block", mt:1}} variant="body2" >
                  Forgot password?
                </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export { LoginPage };
