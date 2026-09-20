import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Avatar, IconButton } from '@mui/material';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import PersonIcon from '@mui/icons-material/Person';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

interface NavbarProps {
  activeTab: 'home' | 'planner' | 'saved';
  setActiveTab: (tab: 'home' | 'planner' | 'saved') => void;
  savedCount?: number;
  userName?: string;
  userRole?: string;
}

const navLinks: { key: 'home' | 'planner' | 'saved'; label: string }[] = [
  { key: 'home', label: 'Explore' },
  { key: 'planner', label: 'Meal Planner' },
  { key: 'saved', label: 'Saved Recipes' },
];

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, savedCount = 0, userName, userRole }) => {
  const initials = userName
    ? userName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '';

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
        <Box
          sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}
          onClick={() => setActiveTab('home')}
        >
          <RestaurantMenuIcon color="primary" sx={{ fontSize: 26 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '1.15rem' }}>
            Chef's <Box component="span" sx={{ color: 'primary.main' }}>Pantry</Box>
          </Typography>
        </Box>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          {navLinks.map((link) => (
            <Box
              key={link.key}
              onClick={() => setActiveTab(link.key)}
              sx={{
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.9rem',
                px: 2,
                py: 0.7,
                borderRadius: 5,
                color: activeTab === link.key ? '#fff' : 'text.secondary',
                bgcolor: activeTab === link.key ? 'primary.main' : 'transparent',
                transition: 'background-color 0.15s ease-in-out, color 0.15s ease-in-out',
                '&:hover': { color: activeTab === link.key ? '#fff' : 'primary.main' },
              }}
            >
              {link.label}
              {link.key === 'saved' && savedCount > 0 && ` (${savedCount})`}
            </Box>
          ))}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {!userName && (
            <Button
              variant="outlined"
              color="primary"
              sx={{ borderRadius: 6, textTransform: 'none', fontWeight: 600, px: 2.5, display: { xs: 'none', sm: 'inline-flex' } }}
            >
              Sign In
            </Button>
          )}
          <IconButton size="small" sx={{ bgcolor: 'action.hover' }} aria-label="notifications">
            <NotificationsNoneIcon fontSize="small" sx={{ color: 'text.secondary' }} />
          </IconButton>
          {userName ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ bgcolor: 'primary.main', color: '#fff', width: 34, height: 34, fontSize: '0.8rem', fontWeight: 700 }}>
                {initials}
              </Avatar>
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                  {userName}
                </Typography>
                {userRole && (
                  <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1 }}>
                    {userRole}
                  </Typography>
                )}
              </Box>
            </Box>
          ) : (
            <Avatar sx={{ bgcolor: '#E6F4EA', color: 'primary.main', width: 34, height: 34 }}>
              <PersonIcon fontSize="small" />
            </Avatar>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};
