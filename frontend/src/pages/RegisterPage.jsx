import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
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

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  // States
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleClickShowPassword = () => setIsPasswordShown((show) => !show);

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Username is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Username must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!agreeTerms) {
      newErrors.terms = 'You must agree to privacy policy & terms';
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
      await register(formData.name.trim(), formData.email.trim(), formData.password);
      toast.success('Registration successful. Please sign in.');
      navigate('/login', {
        state: { successMessage: 'Registration successful. Please login with your credentials.' },
        replace: true,
      });
    } catch (err) {
      if (err.response) {
        if (err.response.status === 409) {
          toast.error('An account with this email already exists. Please sign in instead.');
        } else if (err.response.status === 400) {
          toast.error(err.response.data?.message || 'Please check the registration details and try again.');
        } else {
          toast.error(err.response.data?.message || 'Registration failed. Please try again later.');
        }
      } else if (err.request) {
        toast.error('Unable to connect to the server. Please check your network connection.');
      } else {
        toast.error('An error occurred during registration. Please try again.');
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
              Adventure starts here 🚀
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Make your app management easy and fun!
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
              label="Username"
              required
              name="name"
              placeholder="Enter your username"
              value={formData.name}
              onChange={handleChange}
              error={Boolean(errors.name)}
              helperText={errors.name}
              disabled={loading}
            />

            <CustomTextField
              fullWidth
              label="Email"
              required
              name="email"
              type="email"
              placeholder="Enter your email"
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

            <Box>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    size="small"
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2" color="text.secondary">
                    <span>I agree to </span>
                    <Box
                      component="span"
                      sx={{
                        color: 'primary.main',
                        fontWeight: 500,
                        cursor: 'pointer',
                        '&:hover': { textDecoration: 'underline' },
                      }}
                    >
                      privacy policy & terms
                    </Box>
                  </Typography>
                }
              />
              {errors.terms && (
                <Typography variant="caption" color="error" sx={{ display: 'block', ml: 1.5 }}>
                  {errors.terms}
                </Typography>
              )}
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
              {loading ? <CircularProgress size={22} color="inherit" /> : 'Sign Up'}
            </Button>

            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: 1, mt: 0.5 }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?
              </Typography>
              <Typography
                variant="body2"
                component={RouterLink}
                to="/login"
                sx={{
                  color: 'primary.main',
                  textDecoration: 'none',
                  fontWeight: 600,
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                Sign in instead
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

export default RegisterPage;
