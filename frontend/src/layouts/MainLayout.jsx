import { useState } from 'react';
import { Outlet, useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Badge,
  Tooltip,
  Button,
} from '@mui/material';
import {
  IconSmartHome,
  IconUsers,
  IconBuildingSkyscraper,
  IconCheckbox,
  IconCircleDot,
  IconCircle,
  IconMenu2,
  IconBell,
  IconLogout,
} from '@tabler/icons-react';
import useAuth from '../hooks/useAuth';
import Logo from '../components/layout/shared/Logo';
import CrmLogo from '../components/CrmLogo';

const DRAWER_WIDTH = 260;
const COLLAPSED_DRAWER_WIDTH = 72;

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    Icon: IconSmartHome,
  },
  {
    label: 'Leads',
    path: '/leads',
    Icon: IconUsers,
  },
  {
    label: 'Companies',
    path: '/companies',
    Icon: IconBuildingSkyscraper,
  },
  {
    label: 'Tasks',
    path: '/tasks',
    Icon: IconCheckbox,
  },
];

const MainLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleCollapseToggle = () => {
    setIsCollapsed((prev) => !prev);
    setIsHovered(false);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleProfileMenuClose();
    logout();
    navigate('/login', { replace: true });
  };

  const isNavActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const currentNav = NAV_ITEMS.find((item) => isNavActive(item.path));
  const currentTitle =
    currentNav?.label ||
    (location.pathname.startsWith('/companies/') ? 'Company Details' : 'Overview');

  // If collapsed but hovered, expand to full width
  const isEffectivelyExpanded = isMobile || !isCollapsed || isHovered;
  const currentDrawerWidth = isEffectivelyExpanded ? DRAWER_WIDTH : COLLAPSED_DRAWER_WIDTH;
  const contentMarginLeft = isCollapsed && !isMobile ? COLLAPSED_DRAWER_WIDTH : DRAWER_WIDTH;

  const drawerContent = (
    <Box
      onMouseEnter={() => {
        if (!isMobile && isCollapsed) {
          setIsHovered(true);
        }
      }}
      onMouseLeave={() => {
        if (!isMobile && isCollapsed) {
          setIsHovered(false);
        }
      }}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#FFFFFF',
        overflowX: 'hidden',
        width: currentDrawerWidth,
        transition: 'width 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* Brand Header */}
      <Box
        sx={{
          px: isEffectivelyExpanded ? 2.5 : 1.5,
          py: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: isEffectivelyExpanded ? 'space-between' : 'center',
          minHeight: 64,
          flexShrink: 0,
        }}
      >
        {isEffectivelyExpanded ? (
          <RouterLink to="/" style={{ textDecoration: 'none', display: 'flex' }}>
            <Logo />
          </RouterLink>
        ) : (
          <RouterLink to="/" style={{ textDecoration: 'none', display: 'flex' }}>
            <CrmLogo size={32} />
          </RouterLink>
        )}

        {!isMobile && (
          <IconButton
            size="small"
            onClick={handleCollapseToggle}
            sx={{
              color: 'text.secondary',
              p: 0.5,
              display: isEffectivelyExpanded ? 'flex' : 'none',
              '&:hover': { bgcolor: 'action.hover', color: 'primary.main' },
            }}
          >
            {isCollapsed ? <IconCircle size={20} /> : <IconCircleDot size={20} />}
          </IconButton>
        )}
      </Box>

      {/* Menu Section Label with line */}
      {isEffectivelyExpanded ? (
        <Box sx={{ display: 'flex', alignItems: 'center', px: 3, pt: 2.5, pb: 1, flexShrink: 0 }}>
          <Typography
            sx={{
              textTransform: 'uppercase',
              fontSize: '0.6875rem',
              fontWeight: 600,
              color: 'text.disabled',
              letterSpacing: '0.08em',
              whiteSpace: 'nowrap',
              mr: 1.5,
            }}
          >
            CRM Modules
          </Typography>
          <Box sx={{ flexGrow: 1, height: '1px', bgcolor: 'rgba(47, 43, 61, 0.12)' }} />
        </Box>
      ) : (
        <Box sx={{ width: '1.25rem', height: '1px', bgcolor: 'rgba(47, 43, 61, 0.12)', mx: 'auto', my: 2, flexShrink: 0 }} />
      )}

      {/* Main Navigation List */}
      <List sx={{ px: isEffectivelyExpanded ? 1.75 : 1, py: 0.5, flexGrow: 1 }}>
        {NAV_ITEMS.map((item) => {
          const active = isNavActive(item.path);
          const ItemIcon = item.Icon;

          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <Tooltip
                title={!isEffectivelyExpanded ? item.label : ''}
                placement="right"
                arrow
              >
                <ListItemButton
                  component={RouterLink}
                  to={item.path}
                  onClick={() => isMobile && setMobileOpen(false)}
                  selected={active}
                  sx={{
                    borderRadius: '6px',
                    minHeight: 42,
                    py: 1,
                    px: isEffectivelyExpanded ? 1.75 : 1.25,
                    justifyContent: isEffectivelyExpanded ? 'flex-start' : 'center',
                    transition: 'all 0.15s ease-in-out',
                    color: active ? '#FFFFFF !important' : '#2F2B3D',
                    ...(active && {
                      background: 'linear-gradient(270deg, rgba(115, 103, 240, 0.7) 0%, #7367F0 100%) !important',
                      boxShadow: '0 2px 6px 0 rgba(115, 103, 240, 0.4)',
                      '& .MuiListItemIcon-root': {
                        color: '#FFFFFF !important',
                      },
                    }),
                    '&:hover': {
                      bgcolor: active
                        ? 'linear-gradient(270deg, rgba(103, 93, 216, 0.7) 0%, #675DD8 100%) !important'
                        : 'rgba(47, 43, 61, 0.04)',
                      color: active ? '#FFFFFF' : '#7367F0',
                      '& .MuiListItemIcon-root': {
                        color: active ? '#FFFFFF' : '#7367F0',
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: isEffectivelyExpanded ? 36 : 0,
                      color: active ? '#FFFFFF !important' : 'text.secondary',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'color 0.15s ease',
                    }}
                  >
                    <ItemIcon size={22} stroke={1.75} />
                  </ListItemIcon>

                  {isEffectivelyExpanded && (
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontSize: '0.9375rem',
                        fontWeight: active ? 600 : 500,
                        color: 'inherit',
                      }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ borderColor: 'rgba(47, 43, 61, 0.08)' }} />

      {/* User Card in Sidebar Footer */}
      <Box sx={{ p: 2, flexShrink: 0 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            p: 1.25,
            borderRadius: 2,
            bgcolor: 'rgba(115, 103, 240, 0.06)',
            justifyContent: isEffectivelyExpanded ? 'flex-start' : 'center',
          }}
        >
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            variant="dot"
            sx={{
              '& .MuiBadge-badge': {
                bgcolor: '#28C76F',
                boxShadow: '0 0 0 2px #FFFFFF',
                width: 8,
                height: 8,
                borderRadius: '50%',
              },
            }}
          >
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: 'primary.main',
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
            >
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </Avatar>
          </Badge>

          {isEffectivelyExpanded && (
            <Box sx={{ overflow: 'hidden', minWidth: 0 }}>
              <Typography variant="body2" fontWeight={600} color="text.primary" noWrap>
                {user?.name || 'Nexora User'}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap display="block">
                {user?.email || ''}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <CssBaseline />

      {/* Top Navbar */}
      <AppBar
        position="fixed"
        sx={{
          width: { lg: `calc(100% - ${contentMarginLeft}px)` },
          ml: { lg: `${contentMarginLeft}px` },
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          bgcolor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid rgba(47, 43, 61, 0.12)',
        }}
      >
        <Toolbar sx={{ minHeight: 64, px: { xs: 2, sm: 3 }, justifyContent: 'space-between' }}>
          {/* Left: Mobile Toggle & Page Title */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ display: { lg: 'none' }, color: 'text.primary' }}
              aria-label="open navigation drawer"
            >
              <IconMenu2 size={22} />
            </IconButton>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography variant="h5" fontWeight={600} color="text.primary">
                {currentTitle}
              </Typography>
            </Box>
          </Box>

          {/* Right Header Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Tooltip title="Notifications">
              <IconButton size="small" sx={{ color: 'text.secondary' }}>
                <Badge
                  color="error"
                  variant="dot"
                  sx={{
                    '& .MuiBadge-badge': {
                      bgcolor: '#FF4C51',
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                    },
                  }}
                >
                  <IconBell size={20} />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Profile Menu Trigger */}
            <IconButton
              onClick={handleProfileMenuOpen}
              size="small"
              aria-label="user profile menu"
              sx={{
                p: 0.5,
                border: '1px solid rgba(47, 43, 61, 0.12)',
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
                sx={{
                  '& .MuiBadge-badge': {
                    bgcolor: '#28C76F',
                    boxShadow: '0 0 0 2px #FFFFFF',
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: 34,
                    height: 34,
                    bgcolor: 'primary.main',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                  }}
                >
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </Avatar>
              </Badge>
            </IconButton>

            {/* Vuexy-style User Dropdown Menu */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleProfileMenuClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              PaperProps={{
                elevation: 2,
                sx: {
                  minWidth: 230,
                  borderRadius: 2.5,
                  mt: 1.5,
                  p: 1,
                  boxShadow: '0 4px 18px 0 rgba(47, 43, 61, 0.12)',
                  border: '1px solid rgba(47, 43, 61, 0.12)',
                },
              }}
            >
              <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar
                  sx={{
                    width: 38,
                    height: 38,
                    bgcolor: 'primary.main',
                    fontWeight: 600,
                  }}
                >
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </Avatar>
                <Box sx={{ overflow: 'hidden' }}>
                  <Typography variant="body2" fontWeight={600} color="text.primary" noWrap>
                    {user?.name || 'Account Executive'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap display="block">
                    {user?.email}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 1, borderColor: 'rgba(47, 43, 61, 0.08)' }} />

              <MenuItem
                component={RouterLink}
                to="/dashboard"
                onClick={handleProfileMenuClose}
                sx={{ py: 1, px: 2, borderRadius: 1.5, gap: 1.5 }}
              >
                <IconSmartHome size={18} color="#6D6777" />
                <Typography variant="body2" color="text.primary">
                  Dashboard
                </Typography>
              </MenuItem>

              <MenuItem
                component={RouterLink}
                to="/leads"
                onClick={handleProfileMenuClose}
                sx={{ py: 1, px: 2, borderRadius: 1.5, gap: 1.5 }}
              >
                <IconUsers size={18} color="#6D6777" />
                <Typography variant="body2" color="text.primary">
                  My Leads
                </Typography>
              </MenuItem>

              <Divider sx={{ my: 1, borderColor: 'rgba(47, 43, 61, 0.08)' }} />

              <Box sx={{ p: 1 }}>
                <Button
                  fullWidth
                  variant="contained"
                  color="error"
                  size="small"
                  startIcon={<IconLogout size={16} />}
                  onClick={handleLogout}
                  sx={{
                    borderRadius: 2,
                    fontWeight: 600,
                    py: 1,
                  }}
                >
                  Logout
                </Button>
              </Box>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer Sidebar */}
      <Box
        component="nav"
        sx={{
          width: { lg: contentMarginLeft },
          flexShrink: { lg: 0 },
        }}
        aria-label="crm navigation drawer"
      >
        {/* Mobile temporary drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', lg: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              borderRight: '1px solid rgba(47, 43, 61, 0.12)',
            },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Desktop persistent / hovering drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', lg: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: currentDrawerWidth,
              borderRight: '1px solid rgba(47, 43, 61, 0.12)',
              overflowX: 'hidden',
              transition: 'width 0.22s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.22s ease',
              ...(isCollapsed && isHovered && {
                boxShadow: '0 4px 18px 0 rgba(47, 43, 61, 0.16)',
                zIndex: 1200,
              }),
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main Content Area + Vuexy Footer */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          width: { lg: `calc(100% - ${contentMarginLeft}px)` },
          mt: '64px',
          minHeight: 'calc(100vh - 64px)',
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        {/* Main Page View */}
        <Box sx={{ p: { xs: 2.5, sm: 3.5 }, flexGrow: 1 }}>
          <Outlet />
        </Box>

        {/* Vuexy-style Footer */}
        <Box
          component="footer"
          sx={{
            px: { xs: 2.5, sm: 3.5 },
            py: 2.5,
            borderTop: '1px solid rgba(47, 43, 61, 0.08)',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 1.5,
            bgcolor: 'transparent',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            <span>© {new Date().getFullYear()}, Made with </span>
            <Box component="span" sx={{ color: 'error.main' }}>
              ❤️
            </Box>
            <span> for </span>
            <Box component="span" sx={{ fontWeight: 600, color: 'primary.main' }}>
              Nexora CRM
            </Box>
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
            >
              Documentation
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
            >
              Support
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
            >
              License
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
