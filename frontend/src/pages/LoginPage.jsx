import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import {
  IconEye,
  IconEyeOff,
  IconBrandFacebookFilled,
  IconBrandTwitterFilled,
  IconBrandGithubFilled,
  IconBrandGoogleFilled,
} from '@tabler/icons-react';
import { toast } from 'react-toastify';

import Logo from '@components/layout/shared/Logo';
import CustomTextField from '@core/components/mui/TextField';
import AuthIllustrationWrapper from '@components/AuthIllustrationWrapper';
import useAuth from '../hooks/useAuth';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // States
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const redirectPath = location.state?.from?.pathname || '/dashboard';

  // Read success message passed from registration redirect
  useEffect(() => {
    if (location.state?.successMessage) {
      toast.success(location.state.successMessage);
    } else if (location.state?.registered) {
      toast.success('Registration successful. Please login with your credentials.');
    }
  }, [location.state]);

  const handleClickShowPassword = () => setIsPasswordShown((show) => !show);

  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      await login(formData.email.trim(), formData.password);
      toast.success('Login successful');
      navigate(redirectPath, { replace: true });
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) {
          toast.error('Invalid email or password');
        } else if (err.response.status === 400) {
          toast.error(err.response.data?.message || 'Please provide a valid email and password.');
        } else {
          toast.error(err.response.data?.message || 'An unexpected error occurred. Please try again.');
        }
      } else if (err.request) {
        toast.error('Unable to connect to the server. Please check your network connection.');
      } else {
        toast.error('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthIllustrationWrapper>
      <Card
        sx={{
          width: '100%',
          maxWidth: 450,
          borderRadius: 2.5,
          border: '1px solid rgba(47, 43, 61, 0.12)',
          boxShadow: '0 4px 24px 0 rgba(47, 43, 61, 0.08)',
          bgcolor: 'background.paper',
        }}
      >
        <CardContent sx={{ p: { xs: 3.5, sm: 5 } }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <RouterLink to="/" style={{ textDecoration: 'none' }}>
              <Logo />
            </RouterLink>
          </Box>

          {/* Heading */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 3.5 }}>
            <Typography variant="h5" fontWeight={600} color="text.primary" sx={{ fontSize: '1.25rem' }}>
              Welcome to Nexora CRM! 👋🏻
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please sign-in to your account and start the adventure
            </Typography>
          </Box>

          {/* Form */}
          <Box
            component="form"
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2.25 }}
          >
            <CustomTextField
              autoFocus
              fullWidth
              label="Email or Username"
              required
              name="email"
              type="email"
              placeholder="Enter your email or username"
              value={formData.email}
              onChange={handleChange}
              error={Boolean(errors.email)}
              helperText={errors.email}
              disabled={loading}
            />

            <CustomTextField
              fullWidth
              label="Password"
              required
              name="password"
              placeholder="············"
              id="outlined-adornment-password"
              type={isPasswordShown ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              error={Boolean(errors.password)}
              helperText={errors.password}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={handleClickShowPassword}
                      onMouseDown={(e) => e.preventDefault()}
                      size="small"
                      aria-label="toggle password visibility"
                      sx={{ color: 'text.secondary' }}
                    >
                      {isPasswordShown ? <IconEyeOff size={20} /> : <IconEye size={20} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    size="small"
                    color="primary"
                  />
                }
                label={<Typography variant="body2" color="text.secondary">Remember me</Typography>}
              />
              <Typography
                variant="body2"
                component={RouterLink}
                to="/register"
                sx={{
                  color: 'primary.main',
                  textDecoration: 'none',
                  fontWeight: 500,
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                Forgot password?
              </Typography>
            </Box>

            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={loading}
              size="large"
              sx={{
                py: 1.25,
                fontWeight: 600,
                fontSize: '0.9375rem',
                borderRadius: 2,
                boxShadow: '0 2px 6px rgba(115, 103, 240, 0.38)',
              }}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : 'Login'}
            </Button>

            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: 1, mt: 0.5 }}>
              <Typography variant="body2" color="text.secondary">
                New on our platform?
              </Typography>
              <Typography
                variant="body2"
                component={RouterLink}
                to="/register"
                sx={{
                  color: 'primary.main',
                  textDecoration: 'none',
                  fontWeight: 600,
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                Create an account
              </Typography>
            </Box>

            <Divider sx={{ my: 0.5, color: 'text.secondary', fontSize: '0.85rem' }}>or</Divider>

            {/* Social Logins */}
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1.5 }}>
              <IconButton size="small" sx={{ color: '#4267B2', bgcolor: 'rgba(66, 103, 178, 0.08)' }}>
                <IconBrandFacebookFilled size={18} />
              </IconButton>
              <IconButton size="small" sx={{ color: '#1DA1F2', bgcolor: 'rgba(29, 161, 242, 0.08)' }}>
                <IconBrandTwitterFilled size={18} />
              </IconButton>
              <IconButton size="small" sx={{ color: '#24292F', bgcolor: 'rgba(36, 41, 47, 0.08)' }}>
                <IconBrandGithubFilled size={18} />
              </IconButton>
              <IconButton size="small" sx={{ color: '#DB4437', bgcolor: 'rgba(219, 68, 55, 0.08)' }}>
                <IconBrandGoogleFilled size={18} />
              </IconButton>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </AuthIllustrationWrapper>
  );
};

export default LoginPage;
