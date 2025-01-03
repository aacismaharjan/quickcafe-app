import React, { useState, useEffect } from 'react';
import { Box, Button, Container, TextField, Typography, Link } from '@mui/material';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();
  const { login, user } = useAuth();

  useEffect(() => {
    if (user) {
      console.log(user);
      toast.info('You are already logged in!');
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async () => {
    await login(email, password);
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: 8,
        }}
      >
        <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
          QuickCafe Aashish
        </Typography>
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
        <Link href="/register" variant="body2" sx={{ mt: 2 }}>
          Don't have an account? Register here
        </Link>
      </Box>
    </Container>
  );
};

export { LoginPage };
