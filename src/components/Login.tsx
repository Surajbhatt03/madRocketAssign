import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { 
  Button, Container, TextField, Typography, Box, Paper,
  InputAdornment, IconButton 
} from '@mui/material';
import { Person, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth } from '../firebase';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Successfully logged in!');
      navigate('/');
    } catch (err) {
      toast.error('Login failed. Please check your credentials.');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        background: 'linear-gradient(135deg, #1976d2 0%, #64b5f6 100%)',
      }}
    >
      <Container maxWidth="sm" sx={{ display: 'flex', alignItems: 'center' }}>
        <Paper 
          elevation={12}
          sx={{
            width: '100%',
            p: 4,
            borderRadius: 3,
            background: '#ffffff',
          }}
        >
          <Typography 
            variant="h4" 
            sx={{ 
              mb: 4, 
              textAlign: 'center', 
              fontWeight: 700,
              color: '#1976d2',
            }}
          >
            Welcome Back
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                  <Person sx={{ color: '#1976d2' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: '#fff',
                '&.Mui-focused fieldset': {
                  borderColor: '#1976d2',
                },
                '& input': {
                  '&:-webkit-autofill': {
                    '-webkit-box-shadow': '0 0 0 30px white inset',
                    '-webkit-text-fill-color': 'inherit',
                    'transition': 'background-color 5000s ease-in-out 0s',
                  },
                },
              },
            }}
          />
            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              margin="normal"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: '#1976d2' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: '#1976d2' }}
                    >
                      {!showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: '#fff',
                  '&.Mui-focused fieldset': {
                    borderColor: '#1976d2',
                  },
                  '& input': {
                    '&:-webkit-autofill': {
                      WebkitBoxShadow: '0 0 0 30px white inset !important',
                      WebkitTextFillColor: '#000 !important',
                      backgroundColor: 'white !important',
                    },
                  },
                },
              }}
            />
            <Button 
              type="submit" 
              variant="contained" 
              fullWidth 
              sx={{ 
                mt: 3, 
                mb: 2,
                py: 1.5,
                borderRadius: 2,
                backgroundColor: '#1976d2',
                '&:hover': {
                  backgroundColor: '#1565c0',
                },
                textTransform: 'none',
                fontSize: '1rem',
              }}
            >
              Sign In
            </Button>
          </form>
        </Paper>
      </Container>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </Box>
  );
}

export default Login;
