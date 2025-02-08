import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { deepOrange } from '@mui/material/colors';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_SERVER } from '../utils/AxiosInstance';

const ResetPasswordPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isOTPGenerated, setIsOTPGenerated] = useState<boolean>(false);
  const [isOTPVerified, setIsOTPVerified] = useState<boolean>(false);
  const [step, setStep] = useState<0 | 1 | 2>(0); // Step 0: Request OTP, Step 1: Verify OTP, Step 2: Reset Password
  const navigate = useNavigate();

  // Load state from localStorage on page load
  useEffect(() => {
    const savedState = localStorage.getItem('reset-password-state');
    if (savedState) {
      const { email, otp, newPassword, confirmPassword, isOTPGenerated, isOTPVerified } = JSON.parse(savedState);
      setEmail(email || '');
      setOtp(otp || '');
      setNewPassword(newPassword || '');
      setConfirmPassword(confirmPassword || '');
      setIsOTPGenerated(isOTPGenerated || false);
      setIsOTPVerified(isOTPVerified || false);
    }
  }, []);

  useEffect(() => {
    if (email || otp || newPassword || confirmPassword) {
      // Save state to localStorage on change
      const stateToSave = { email, otp, newPassword, confirmPassword, isOTPGenerated, isOTPVerified };
      localStorage.setItem('reset-password-state', JSON.stringify(stateToSave));
    }

    // Auto-update step based on isOTPGenerated and isOTPVerified
    if (isOTPGenerated && !isOTPVerified) {
      setStep(1); // OTP generated, proceed to step 1
    } else if (isOTPVerified) {
      setStep(2); // OTP verified, proceed to step 2
    } else {
      setStep(0); // Initial step (email entry)
    }
  }, [email, otp, newPassword, confirmPassword, isOTPGenerated, isOTPVerified]);

  const handleRequestReset = async () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      const response = await axios.post<{ success: boolean; message: string }>(
        `${API_SERVER}/api/v1/auth/request-reset`,
        { email }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setIsOTPGenerated(true); // OTP has been generated
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || 'An error occurred. Please try again later.');
      } else {
        toast.error('An error occurred. Please try again later.');
      }
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.error('Please enter the OTP');
      return;
    }

    try {
      const response = await axios.post<{ success: boolean; message: string }>(`${API_SERVER}/api/v1/auth/verify-otp`, {
        email,
        otp,
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setIsOTPVerified(true); // OTP has been verified
      } else {
        toast.error(response.data.message);
      }
    } catch {
      toast.error('OTP verification failed');
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast.error('Please enter both new password fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    const resetPasswordData = {
      email,
      newPassword,
      confirmPassword,
      otp,
    };

    try {
      const response = await axios.post(`${API_SERVER}/api/v1/auth/reset-password`, resetPasswordData);

      if (response.data.success) {
        toast.success('Password successfully reset!');
        localStorage.clear(); // Clear state after password reset
        setIsOTPGenerated(false);
        setIsOTPVerified(false);
        navigate('/login');
      } else {
        toast.error(response.data.message || 'Failed to reset password. Please try again.');
      }
    } catch {
      toast.error('Failed to reset password. Please try again.');
    }
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
          <Box sx={{ maxWidth: '620px', width: '100%' }}>
            {/* Content based on current step */}
            {step === 0 ? (
              <>
                <Typography variant="h5">Reset Password</Typography>
                <Typography>Enter your email to receive an OTP.</Typography>
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Box sx={{ display: 'flex', gap: 2, marginTop: 2 }}>
                  <Button component={Link} to="/login" variant="outlined" fullWidth>
                    Back to login
                  </Button>
                  <Button variant="contained" color="primary" onClick={handleRequestReset} fullWidth>
                    Send OTP
                  </Button>
                </Box>
              </>
            ) : step === 1 ? (
              <>
                <Typography variant="h5">Verify OTP</Typography>
                <Typography>Enter the OTP sent to your email.</Typography>
                <TextField
                  label="OTP"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <Box sx={{ display: 'flex', gap: 2, marginTop: 2 }}>
                  <Button variant="outlined" onClick={() => {
                    setIsOTPGenerated(false);
                    setStep(0);
                  }} fullWidth>
                    Back
                  </Button>
                  <Button variant="contained" color="primary" onClick={handleVerifyOtp} fullWidth>
                    Verify OTP
                  </Button>
                </Box>
              </>
            ) : (
              <>
                <Typography variant="h5">Set New Password</Typography>
                <TextField
                  label="New Password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={newPassword}
                  slotProps={{ htmlInput: { autoComplete: 'new-password' } }}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <TextField
                  label="Confirm Password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={confirmPassword}
                  slotProps={{ htmlInput: { autoComplete: 'new-password' } }}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Box sx={{ display: 'flex', gap: 2, marginTop: 2 }}>
                  <Button variant="outlined" onClick={() => {
                    setIsOTPVerified(false);
                    setStep(1);
                  }} fullWidth>
                    Back
                  </Button>
                  <Button variant="contained" color="primary" onClick={handleResetPassword} fullWidth>
                    Reset Password
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export { ResetPasswordPage };
